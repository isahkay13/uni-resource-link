
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserAvatar from './UserAvatar';

interface ChannelMember {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
}

interface ChannelMembersListProps {
  channelId: string;
}

const ChannelMembersList: React.FC<ChannelMembersListProps> = ({ channelId }) => {
  const [members, setMembers] = useState<ChannelMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Get all member user_ids for this channel
        const { data: memberData, error: memberError } = await supabase
          .from('channel_members')
          .select('user_id')
          .eq('channel_id', channelId);

        if (memberError) throw memberError;

        if (!memberData || memberData.length === 0) {
          setMembers([]);
          setIsLoading(false);
          return;
        }

        // Extract user_ids
        const userIds = memberData.map(item => item.user_id);

        // Get profile data for each member
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, role, avatar_url')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        if (profilesData) {
          setMembers(profilesData);
        }
      } catch (error) {
        console.error('Error fetching channel members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (channelId) {
      fetchMembers();
      
      // Set up real-time listener for member changes
      const channel = supabase
        .channel('members-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'channel_members',
            filter: `channel_id=eq.${channelId}`
          },
          () => {
            // Refetch the members when changes occur
            fetchMembers();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [channelId]);

  if (isLoading) {
    return <div className="text-center p-4">Loading members...</div>;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Channel Members ({members.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {members.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">No members yet</p>
        ) : (
          members.map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <UserAvatar
                user={{
                  id: member.id,
                  name: member.name,
                  role: member.role as any,
                  avatar: member.avatar_url || undefined
                }}
                size="sm"
              />
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-gray-500 capitalize">{member.role}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ChannelMembersList;
