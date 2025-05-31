
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { Channel, Chat, Tutorial, File } from '../types';

interface AppContextType {
  channels: Channel[];
  chats: Chat[];
  tutorials: Tutorial[];
  files: File[];
  assignments: any[];
  loading: boolean;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChannels = async () => {
    try {
      const { data: channelsData, error: channelsError } = await supabase
        .from('channels')
        .select('*');

      if (channelsError) throw channelsError;

      // Fetch channel members for each channel
      const channelsWithMembers = await Promise.all(
        channelsData.map(async (channel) => {
          const { data: membersData, error: membersError } = await supabase
            .from('channel_members')
            .select('user_id')
            .eq('channel_id', channel.id);

          if (membersError) throw membersError;

          return {
            id: channel.id,
            name: channel.name,
            description: channel.description || '',
            type: channel.type as 'year' | 'course' | 'department' | 'interest',
            members: membersData.map(m => m.user_id),
            messages: []
          };
        })
      );

      setChannels(channelsWithMembers);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const fetchTutorials = async () => {
    try {
      const { data, error } = await supabase
        .from('tutorials')
        .select(`
          *,
          profiles!tutorials_author_id_fkey(name, role)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTutorials: Tutorial[] = data.map(tutorial => ({
        id: tutorial.id,
        title: tutorial.title,
        content: tutorial.content,
        authorId: tutorial.author_id,
        authorName: tutorial.profiles?.name || 'Unknown',
        createdAt: tutorial.created_at,
        upvotes: tutorial.upvotes || 0,
        tags: tutorial.tags || [],
        channelId: tutorial.channel_id
      }));

      setTutorials(formattedTutorials);
    } catch (error) {
      console.error('Error fetching tutorials:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('file_attachments')
        .select(`
          *,
          profiles!file_attachments_uploader_id_fkey(name)
        `)
        .order('upload_date', { ascending: false });

      if (error) throw error;

      const formattedFiles: File[] = data.map(file => ({
        id: file.id,
        name: file.name,
        size: file.file_size,
        type: file.file_type,
        uploadDate: file.upload_date,
        uploaderId: file.uploader_id,
        uploaderName: file.profiles?.name || 'Unknown',
        path: file.storage_path,
        channelId: file.channel_id,
        description: file.description
      }));

      setFiles(formattedFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          profiles!assignments_instructor_id_fkey(name, role)
        `)
        .order('due_date', { ascending: true });

      if (error) throw error;

      setAssignments(data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    await Promise.all([
      fetchChannels(),
      fetchTutorials(),
      fetchFiles(),
      fetchAssignments()
    ]);
    setLoading(false);
  };

  const refreshData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <AppContext.Provider value={{
      channels,
      chats,
      tutorials,
      files,
      assignments,
      loading,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
