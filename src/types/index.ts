
export type UserRole = 'student' | 'academic' | 'nonacademic';

export interface User {
  id: string;
  name: string;
  email?: string;
  universityId?: string;
  role: UserRole;
  avatar?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  fileAttachments?: FileAttachment[];
  read: boolean;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploaderId: string;
  uploadDate: Date;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'year' | 'course' | 'department' | 'interest';
  members: string[]; // User IDs
  messages: Message[];
}

export interface Chat {
  id: string;
  participants: string[]; // User IDs
  isGroup: boolean;
  groupName?: string;
  messages: Message[];
  lastActivity: Date;
}

export interface Tutorial {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  attachments: FileAttachment[];
  tags: string[];
  upvotes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  timestamp: Date;
}
