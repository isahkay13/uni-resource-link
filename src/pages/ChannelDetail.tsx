
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import UserAvatar from '../components/UserAvatar';
import { Channel, Message } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Send } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface MessageWithUser extends Message {
  profiles: {
    name: string;
    avatar_url: string | null;
    role: string;
  };
}

interface MessageData {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  is_pinned: boolean;
  profiles?: {
    name: string;
    avatar_url: string | null;
    role: string;
  };
}

const ChannelDetail = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { user } = useAuth();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        if (!channelId) return;
        
        const { data, error } = await supabase
          .from('channels')
          .select('*')
          .eq('id', channelId)
          .single();
          
        if (error) throw error;
        
        setChannel({
          id: data.id,
          name: data.name,
          description: data.description || '',
          type: data.type as 'year' | 'course' | 'department' | 'interest',
          members: [],
          messages: []
        });
        
        fetchMessages();
      } catch (error) {
        console.error('Error fetching channel:', error);
        toast.error('Failed to load channel');
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchMessages = async () => {
      try {
        if (!channelId) return;
        
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id, 
            content, 
            created_at, 
            is_pinned,
            user_id,
            profiles:user_id (name, avatar_url, role)
          `)
          .eq('channel_id', channelId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          // Convert to our Message type
          const formattedMessages: MessageWithUser[] = data.map((item: MessageData) => ({
            id: item.id,
            content: item.content,
            senderId: item.user_id,
            timestamp: new Date(item.created_at),
            read: true,
            profiles: item.profiles || {
              name: 'Unknown User',
              avatar_url: null,
              role: 'student'
            }
          }));
          
          setMessages(formattedMessages);
          scrollToBottom();
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    
    // Set up real-time subscription for new messages
    let subscription: any;
    
    if (channelId) {
      fetchChannel();
      
      subscription = supabase
        .channel('messages-channel')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `channel_id=eq.${channelId}`
          }, 
          async (payload) => {
            // When a new message comes in, fetch the user profile
            const { data, error } = await supabase
              .from('profiles')
              .select('name, avatar_url, role')
              .eq('id', payload.new.user_id)
              .single();
              
            if (error) {
              console.error('Error fetching user profile:', error);
              return;
            }
            
            const newMsg: MessageWithUser = {
              id: payload.new.id,
              content: payload.new.content,
              senderId: payload.new.user_id,
              timestamp: new Date(payload.new.created_at),
              read: true,
              profiles: data
            };
            
            setMessages(prev => [...prev, newMsg]);
            scrollToBottom();
          }
        )
        .subscribe();
    }
    
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [channelId]);
  
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !channelId || !user) return;
    
    setIsSending(true);
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          channel_id: channelId,
          user_id: user.id,
          content: newMessage.trim()
        });
      
      if (error) throw error;
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 pt-20">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading channel...</p>
        </div>
      </div>
    );
  }
  
  if (!channel) {
    return (
      <div className="container mx-auto p-4 pt-20">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Channel not found</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 pt-20 max-w-4xl pb-20 md:pb-4">
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-xl">{channel.name}</CardTitle>
          <p className="text-sm text-gray-500">{channel.description}</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col h-[60vh]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-400">No messages yet. Be the first to send a message!</p>
                </div>
              ) : (
                messages.map((message) => (
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
                        role: message.profiles?.role as any,
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
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t">
              <form onSubmit={sendMessage} className="flex gap-2">
                <Textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="min-h-[50px] resize-none"
                  disabled={isSending}
                />
                <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChannelDetail;
