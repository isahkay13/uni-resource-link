
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Channel, Message } from '../types';
import { toast } from '@/components/ui/sonner';
import ChannelMembersList from '../components/ChannelMembersList';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import ChannelHeader from '../components/chat/ChannelHeader';

interface MessageWithUser extends Message {
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
  const [isLoading, setIsLoading] = useState(true);

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
        
        // First fetch the messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select(`
            id, 
            content, 
            created_at, 
            is_pinned,
            user_id
          `)
          .eq('channel_id', channelId)
          .order('created_at', { ascending: true });
          
        if (messagesError) throw messagesError;
        
        if (messagesData && messagesData.length > 0) {
          // Get all user IDs from messages
          const userIds = [...new Set(messagesData.map(msg => msg.user_id))];
          
          // Fetch profiles for all users
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, name, avatar_url, role')
            .in('id', userIds);
            
          if (profilesError) throw profilesError;
          
          // Create a map of user IDs to profiles
          const profilesMap = new Map();
          if (profilesData) {
            profilesData.forEach(profile => {
              profilesMap.set(profile.id, profile);
            });
          }
          
          // Combine messages with user profiles
          const formattedMessages: MessageWithUser[] = messagesData.map(item => {
            const profile = profilesMap.get(item.user_id);
            return {
              id: item.id,
              content: item.content,
              senderId: item.user_id,
              timestamp: new Date(item.created_at),
              read: true,
              profiles: profile ? {
                name: profile.name,
                avatar_url: profile.avatar_url,
                role: profile.role
              } : {
                name: 'Unknown User',
                avatar_url: null,
                role: 'student'
              }
            };
          });
          
          setMessages(formattedMessages);
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
    <div className="container mx-auto p-4 pt-20 max-w-6xl pb-20 md:pb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gray-50 border-b">
              <ChannelHeader name={channel.name} description={channel.description} />
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col h-[60vh]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <MessageList messages={messages} />
                </div>
                <div className="p-4 border-t">
                  {user && channelId && (
                    <MessageInput channelId={channelId} userId={user.id} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          {channelId && <ChannelMembersList channelId={channelId} />}
        </div>
      </div>
    </div>
  );
};

export default ChannelDetail;
