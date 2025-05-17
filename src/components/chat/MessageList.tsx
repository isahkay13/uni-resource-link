
import React, { useRef, useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import UserAvatar from '../UserAvatar';
import { Message } from '../../types';
import { useAuth } from '../../context/AuthContext';
import TypingIndicator from './TypingIndicator';
import { supabase } from '@/integrations/supabase/client';

interface MessageWithUser extends Message {
  profiles?: {
    name: string;
    avatar_url: string | null;
    role: string;
  };
}

interface MessageListProps {
  messages: MessageWithUser[];
  channelId: string;
}

interface TypingUser {
  userId: string;
  name: string;
}

const MessageList = ({ messages, channelId }: MessageListProps) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  useEffect(() => {
    // Set up real-time subscription for typing events
    const channel = supabase.channel('typing')
      .on('broadcast', { event: 'typing' }, async (payload) => {
        if (
          payload.payload.channel_id === channelId && 
          payload.payload.user_id !== user?.id
        ) {
          // Fetch user name if not already in typing users
          if (!typingUsers.some(u => u.userId === payload.payload.user_id)) {
            try {
              const { data, error } = await supabase
                .from('profiles')
                .select('name')
                .eq('id', payload.payload.user_id)
                .single();
                
              if (error) throw error;
              
              if (data) {
                setTypingUsers(prev => [
                  ...prev, 
                  { userId: payload.payload.user_id, name: data.name }
                ]);
              }
            } catch (error) {
              console.error('Error fetching typing user:', error);
            }
          }
        }
      })
      .on('broadcast', { event: 'typing_stopped' }, (payload) => {
        if (payload.payload.channel_id === channelId) {
          setTypingUsers(prev => 
            prev.filter(user => user.userId !== payload.payload.user_id)
          );
        }
      })
      .subscribe();
      
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-400">No messages yet. Be the first to send a message!</p>
      </div>
    );
  }

  return (
    <>
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex items-start gap-2 ${
            message.senderId === user?.id ? 'flex-row-reverse' : ''
          }`}
        >
          <UserAvatar 
            user={{
              id: message.senderId,
              name: message.profiles?.name || 'Unknown',
              role: (message.profiles?.role || 'student') as any,
              avatar: message.profiles?.avatar_url || undefined
            }}
            size="sm"
          />
          <div 
            className={`
              rounded-lg p-3 max-w-[80%]
              ${message.senderId === user?.id 
                ? 'bg-university-primary text-white' 
                : 'bg-gray-100'}
            `}
          >
            <div className={`text-xs mb-1 ${message.senderId === user?.id ? 'text-gray-100' : 'text-gray-500'}`}>
              {message.profiles?.name || 'Unknown'} • {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </div>
            <p>{message.content}</p>
          </div>
        </div>
      ))}
      
      {typingUsers.length > 0 && (
        <div className="pl-10 my-2">
          {typingUsers.map(typingUser => (
            <TypingIndicator key={typingUser.userId} name={typingUser.name} />
          ))}
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </>
  );
};

export default MessageList;
