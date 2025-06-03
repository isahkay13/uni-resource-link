
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, School, Heart, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Channel } from '../types';

const Channels = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [userChannels, setUserChannels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isStaff = user?.role === 'academic' || user?.role === 'nonacademic';

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        // Fetch all channels
        const { data: channelsData, error: channelsError } = await supabase
          .from('channels')
          .select('*');

        if (channelsError) throw channelsError;

        // Fetch channels user is member of
        const { data: memberData, error: memberError } = await supabase
          .from('channel_members')
          .select('channel_id')
          .eq('user_id', user?.id);

        if (memberError) throw memberError;

        const userChannelIds = memberData.map(item => item.channel_id);
        setUserChannels(userChannelIds);
        
        // Map the data to our Channel type
        const formattedChannels = channelsData.map(channel => ({
          id: channel.id,
          name: channel.name,
          description: channel.description,
          type: channel.type as 'year' | 'course' | 'department' | 'interest',
          members: [],
          messages: []
        }));

        setChannels(formattedChannels);
      } catch (error) {
        console.error('Error fetching channels:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchChannels();
    }
  }, [user]);

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'year':
        return <Users className="h-5 w-5" />;
      case 'course':
        return <BookOpen className="h-5 w-5" />;
      case 'department':
        return <School className="h-5 w-5" />;
      case 'interest':
        return <Heart className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const joinChannel = async (channelId: string) => {
    try {
      const { error } = await supabase
        .from('channel_members')
        .insert({ channel_id: channelId, user_id: user?.id });

      if (error) throw error;
      
      // Update local state
      setUserChannels([...userChannels, channelId]);
    } catch (error) {
      console.error('Error joining channel:', error);
    }
  };

  const leaveChannel = async (channelId: string) => {
    try {
      const { error } = await supabase
        .from('channel_members')
        .delete()
        .eq('channel_id', channelId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      // Update local state
      setUserChannels(userChannels.filter(id => id !== channelId));
    } catch (error) {
      console.error('Error leaving channel:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 pt-20">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading channels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-20 pb-20 md:pb-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">University Channels</h1>
          {isStaff && (
            <Link to="/channels/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Channel
              </Button>
            </Link>
          )}
        </div>
        <p className="text-gray-600">
          Join channels to connect with fellow students and faculty
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <Card key={channel.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getChannelIcon(channel.type)}
                  <CardTitle>{channel.name}</CardTitle>
                </div>
                <Badge variant="outline" className="capitalize">
                  {channel.type}
                </Badge>
              </div>
              <CardDescription>{channel.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              {userChannels.includes(channel.id) ? (
                <Link to={`/channels/${channel.id}`}>
                  <Button variant="secondary" className="w-full">View Channel</Button>
                </Link>
              ) : (
                <Button 
                  onClick={() => joinChannel(channel.id)} 
                  className="w-full"
                >
                  Join Channel
                </Button>
              )}
            </CardContent>
            {userChannels.includes(channel.id) && (
              <CardFooter>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full"
                  onClick={() => leaveChannel(channel.id)}
                >
                  Leave Channel
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Channels;
