
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Link, Navigate } from 'react-router-dom';
import UserAvatar from '../components/UserAvatar';
import { MessageSquare, Book, File, Upload } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { channels, chats, tutorials, files } = useApp();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  const myChannels = channels.filter(channel => channel.members.includes(user.id));
  const myChats = chats.filter(chat => chat.participants.includes(user.id));
  const recentTutorials = [...tutorials].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);
  
  return (
    <div className="container mx-auto p-4 pt-20 pb-20 md:pb-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
        <p className="text-gray-600">
          Here's what's happening at your university today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Your Channels & Chats
            </CardTitle>
            <CardDescription>
              Access your course channels and private conversations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myChannels.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Your Channels</h3>
                {myChannels.map(channel => (
                  <div key={channel.id} className="p-3 border rounded-md bg-gray-50">
                    <Link to={`/channels/${channel.id}`} className="font-medium hover:text-university-primary">
                      {channel.name}
                    </Link>
                    <p className="text-sm text-gray-600">{channel.description}</p>
                    <div className="flex mt-2">
                      <div className="text-xs text-gray-500">
                        {channel.members.length} member{channel.members.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6">
                  <Link to="/channels">
                    <Button variant="outline" className="w-full">View All Channels</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You haven't joined any channels yet</p>
                <Link to="/channels">
                  <Button>Browse Channels</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Recent Tutorials
            </CardTitle>
            <CardDescription>
              Educational resources from your community
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTutorials.length > 0 ? (
              <div className="space-y-3">
                {recentTutorials.map(tutorial => (
                  <Link key={tutorial.id} to={`/tutorials/${tutorial.id}`}>
                    <div className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                      <h3 className="font-medium">{tutorial.title}</h3>
                      <div className="flex gap-2 mt-1 items-center">
                        <div className="text-xs text-gray-500">
                          {new Date(tutorial.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {tutorial.upvotes} upvotes
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                
                <div className="mt-4">
                  <Link to="/tutorials">
                    <Button variant="outline" className="w-full">View All Tutorials</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No tutorials available yet</p>
                <Link to="/tutorials/create">
                  <Button>Create a Tutorial</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/files/upload">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <Upload className="h-4 w-4" /> Upload File
                </Button>
              </Link>
              
              <Link to="/tutorials/create">
                <Button variant="outline" className="w-full">Create Tutorial</Button>
              </Link>
              
              {user.role !== 'student' && (
                <Link to="/channels/create">
                  <Button variant="outline" className="w-full">Create Channel</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              Recent Files
            </CardTitle>
            <CardDescription>
              Recently uploaded files in your channels
            </CardDescription>
          </CardHeader>
          <CardContent>
            {files.length > 0 ? (
              <div className="space-y-2">
                {files.slice(0, 5).map(file => (
                  <div key={file.id} className="p-3 border rounded-md flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                        <File className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">{file.name}</h3>
                        <div className="text-xs text-gray-500">
                          {new Date(file.uploadDate).toLocaleDateString()} • 
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-university-primary">
                      Download
                    </Button>
                  </div>
                ))}
                
                <div className="mt-4">
                  <Link to="/files">
                    <Button variant="outline" className="w-full">View All Files</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No files uploaded yet</p>
                <Link to="/files/upload">
                  <Button>Upload a File</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
