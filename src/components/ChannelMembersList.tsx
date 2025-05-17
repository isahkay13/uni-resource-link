
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import UserAvatar from './UserAvatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        // Join channel_members with profiles to get member details
        const { data, error } = await supabase
          .from('channel_members')
          .select(`
            user_id,
            profiles:user_id (
              id,
              name,
              role,
              avatar_url
            )
          `)
          .eq('channel_id', channelId);

        if (error) throw error;

        // Format the data
        const membersList = data.map(item => ({
          id: item.profiles.id,
          name: item.profiles.name,
          role: item.profiles.role,
          avatar_url: item.profiles.avatar_url
        }));

        setMembers(membersList);
      } catch (error) {
        console.error('Error fetching channel members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (channelId) {
      fetchMembers();
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
                name={member.name}
                avatarUrl={member.avatar_url || undefined}
                role={member.role as any}
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
