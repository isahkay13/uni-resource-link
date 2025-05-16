
import React, { createContext, useState, useContext } from "react";
import { Channel, Chat, Message, Tutorial, FileAttachment, User } from "../types";

interface AppContextType {
  channels: Channel[];
  chats: Chat[];
  tutorials: Tutorial[];
  files: FileAttachment[];
  users: User[];
  createChannel: (channel: Omit<Channel, 'id' | 'messages'>) => void;
  joinChannel: (channelId: string, userId: string) => void;
  sendChannelMessage: (channelId: string, message: Omit<Message, 'id'>) => void;
  createChat: (chat: Omit<Chat, 'id'>) => void;
  sendChatMessage: (chatId: string, message: Omit<Message, 'id'>) => void;
  createTutorial: (tutorial: Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'comments'>) => void;
  uploadFile: (file: Omit<FileAttachment, 'id'>) => void;
}

// Mock data for demonstration
const MOCK_CHANNELS: Channel[] = [
  {
    id: 'channel1',
    name: 'Year 1 Computer Science',
    description: 'General discussion for first-year CS students',
    type: 'year',
    members: ['1', '2'], // User IDs
    messages: []
  },
  {
    id: 'channel2',
    name: 'Data Structures & Algorithms',
    description: 'Course-specific discussions',
    type: 'course',
    members: ['1', '2'],
    messages: []
  }
];

const MOCK_CHATS: Chat[] = [
  {
    id: 'chat1',
    participants: ['1', '2'], // Emma and Professor Ibukun
    isGroup: false,
    messages: [],
    lastActivity: new Date()
  },
  {
    id: 'chat2',
    participants: ['1', '2', '3'], // Group chat
    isGroup: true,
    groupName: 'CS Project Team',
    messages: [],
    lastActivity: new Date()
  }
];

const MOCK_TUTORIALS: Tutorial[] = [
  {
    id: 'tutorial1',
    title: 'Introduction to Data Structures',
    content: 'A comprehensive guide to data structures used in computer science.',
    authorId: '2', // Professor Ibukun
    createdAt: new Date(),
    updatedAt: new Date(),
    attachments: [],
    tags: ['computer-science', 'data-structures'],
    upvotes: 5,
    comments: []
  }
];

const MOCK_FILES: FileAttachment[] = [
  {
    id: 'file1',
    name: 'data-structures.pdf',
    size: 2500000, // 2.5MB
    type: 'application/pdf',
    url: '#', // Would be an actual URL in production
    uploaderId: '2', // Professor Ibukun
    uploadDate: new Date()
  }
];

// Mock users
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    universityId: 'EJ2023',
    role: 'student',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Professor Ibukun',
    email: 'ibukun@university.edu',
    role: 'academic',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Sarah Admin',
    email: 'sarah@university.edu',
    role: 'nonacademic',
    avatar: '/placeholder.svg'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [channels, setChannels] = useState<Channel[]>(MOCK_CHANNELS);
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [tutorials, setTutorials] = useState<Tutorial[]>(MOCK_TUTORIALS);
  const [files, setFiles] = useState<FileAttachment[]>(MOCK_FILES);
  const [users] = useState<User[]>(MOCK_USERS);

  const createChannel = (channel: Omit<Channel, 'id' | 'messages'>) => {
    const newChannel: Channel = {
      ...channel,
      id: `channel_${Date.now()}`,
      messages: []
    };
    setChannels([...channels, newChannel]);
  };

  const joinChannel = (channelId: string, userId: string) => {
    setChannels(channels.map(channel => {
      if (channel.id === channelId && !channel.members.includes(userId)) {
        return {
          ...channel,
          members: [...channel.members, userId]
        };
      }
      return channel;
    }));
  };

  const sendChannelMessage = (channelId: string, message: Omit<Message, 'id'>) => {
    setChannels(channels.map(channel => {
      if (channel.id === channelId) {
        return {
          ...channel,
          messages: [...channel.messages, { ...message, id: `msg_${Date.now()}` }]
        };
      }
      return channel;
    }));
  };

  const createChat = (chat: Omit<Chat, 'id'>) => {
    const newChat: Chat = {
      ...chat,
      id: `chat_${Date.now()}`
    };
    setChats([...chats, newChat]);
  };

  const sendChatMessage = (chatId: string, message: Omit<Message, 'id'>) => {
    setChats(chats.map(chat => {
      if (chat.id === chatId) {
        const newMessage = { ...message, id: `msg_${Date.now()}` };
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastActivity: message.timestamp
        };
      }
      return chat;
    }));
  };

  const createTutorial = (tutorial: Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'comments'>) => {
    const now = new Date();
    const newTutorial: Tutorial = {
      ...tutorial,
      id: `tutorial_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      upvotes: 0,
      comments: []
    };
    setTutorials([...tutorials, newTutorial]);
  };

  const uploadFile = (file: Omit<FileAttachment, 'id'>) => {
    const newFile: FileAttachment = {
      ...file,
      id: `file_${Date.now()}`
    };
    setFiles([...files, newFile]);
  };

  return (
    <AppContext.Provider value={{
      channels,
      chats,
      tutorials,
      files,
      users,
      createChannel,
      joinChannel,
      sendChannelMessage,
      createChat,
      sendChatMessage,
      createTutorial,
      uploadFile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
