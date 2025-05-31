
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { Channel, Chat, Tutorial } from '../types';

interface FileType {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  uploaderId: string;
  uploaderName: string;
  path: string;
  channelId: string | null;
  description: string | null;
}

interface AppContextType {
  channels: Channel[];
  chats: Chat[];
  tutorials: Tutorial[];
  files: FileType[];
  assignments: any[];
  loading: boolean;
  refreshData: () => void;
  uploadFile: (fileData: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [files, setFiles] = useState<FileType[]>([]);
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
      // First get tutorials
      const { data: tutorialsData, error: tutorialsError } = await supabase
        .from('tutorials')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (tutorialsError) throw tutorialsError;

      // Then get author names from profiles
      const authorIds = tutorialsData.map(t => t.author_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, role')
        .in('id', authorIds);

      if (profilesError) {
        console.warn('Could not fetch profiles:', profilesError);
        // Continue with tutorials but without author names
      }

      const formattedTutorials: Tutorial[] = tutorialsData.map(tutorial => {
        const author = profilesData?.find(p => p.id === tutorial.author_id);
        return {
          id: tutorial.id,
          title: tutorial.title,
          content: tutorial.content,
          authorId: tutorial.author_id,
          authorName: author?.name || 'Unknown',
          createdAt: new Date(tutorial.created_at),
          updatedAt: new Date(tutorial.updated_at || tutorial.created_at),
          upvotes: tutorial.upvotes || 0,
          tags: tutorial.tags || [],
          channelId: tutorial.channel_id,
          attachments: [],
          comments: []
        };
      });

      setTutorials(formattedTutorials);
    } catch (error) {
      console.error('Error fetching tutorials:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      // First get files
      const { data: filesData, error: filesError } = await supabase
        .from('file_attachments')
        .select('*')
        .order('upload_date', { ascending: false });

      if (filesError) throw filesError;

      // Then get uploader names from profiles
      const uploaderIds = filesData.map(f => f.uploader_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', uploaderIds);

      if (profilesError) {
        console.warn('Could not fetch profiles:', profilesError);
        // Continue with files but without uploader names
      }

      const formattedFiles: FileType[] = filesData.map(file => {
        const uploader = profilesData?.find(p => p.id === file.uploader_id);
        return {
          id: file.id,
          name: file.name,
          size: file.file_size,
          type: file.file_type,
          uploadDate: file.upload_date,
          uploaderId: file.uploader_id,
          uploaderName: uploader?.name || 'Unknown',
          path: file.storage_path,
          channelId: file.channel_id,
          description: file.description
        };
      });

      setFiles(formattedFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      // First get assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .order('due_date', { ascending: true });

      if (assignmentsError) throw assignmentsError;

      // Then get instructor names from profiles
      const instructorIds = assignmentsData.map(a => a.instructor_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, role')
        .in('id', instructorIds);

      if (profilesError) {
        console.warn('Could not fetch profiles:', profilesError);
        // Continue with assignments but without instructor names
      }

      const formattedAssignments = assignmentsData.map(assignment => {
        const instructor = profilesData?.find(p => p.id === assignment.instructor_id);
        return {
          ...assignment,
          instructor_name: instructor?.name || 'Unknown',
          instructor_role: instructor?.role || 'Unknown'
        };
      });

      setAssignments(formattedAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const uploadFile = async (fileData: any) => {
    try {
      const { data, error } = await supabase
        .from('file_attachments')
        .insert({
          name: fileData.name,
          file_size: fileData.size,
          file_type: fileData.type,
          storage_path: fileData.url,
          uploader_id: fileData.uploaderId,
          description: fileData.description || null,
          channel_id: fileData.channelId || null
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh files data
      await fetchFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
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
      refreshData,
      uploadFile
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
