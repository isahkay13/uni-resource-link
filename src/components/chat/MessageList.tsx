
import React, { useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import UserAvatar from '../UserAvatar';
import { Message } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface MessageWithUser extends Message {
  profiles?: {
    name: string;
    avatar_url: string | null;
    role: string;
  };
}

interface MessageListProps {
  messages: MessageWithUser[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      <div ref={messagesEndRef} />
    </>
  );
};

export default MessageList;
