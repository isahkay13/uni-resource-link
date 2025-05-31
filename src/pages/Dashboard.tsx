
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Link, Navigate } from 'react-router-dom';
import { MessageSquare, Book, File, Upload, Users, Calendar, TrendingUp, Bell, BookOpen, GraduationCap, Briefcase } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { channels, tutorials, files, assignments, loading } = useApp();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 pt-20">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const myChannels = channels.filter(channel => channel.members.includes(user.id));
  const recentTutorials = [...tutorials].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);

  const isStudent = user.role === 'student';
  const isStaff = user.role === 'academic' || user.role === 'nonacademic';
  
  return (
    <div className="container mx-auto p-4 pt-20 pb-20 md:pb-4">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <Badge variant="outline" className="flex items-center gap-1">
            {isStudent ? <GraduationCap className="h-3 w-3" /> : <Briefcase className="h-3 w-3" />}
            {user.role === 'student' ? 'Student' : user.role === 'academic' ? 'Academic Staff' : 'Staff'}
          </Badge>
        </div>
        <p className="text-gray-600">
          {isStudent 
            ? "Stay connected with your courses and fellow students" 
            : "Manage your courses and support student learning"
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Role-specific Quick Stats */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {isStudent ? "Your Academic Overview" : "Teaching & Management Overview"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{myChannels.length}</div>
                <div className="text-sm text-gray-600">
                  {isStudent ? "Enrolled Courses" : "Managed Channels"}
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{tutorials.length}</div>
                <div className="text-sm text-gray-600">
                  {isStudent ? "Available Tutorials" : "Created Tutorials"}
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{files.length}</div>
                <div className="text-sm text-gray-600">Course Files</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{assignments.length}</div>
                <div className="text-sm text-gray-600">
                  {isStudent ? "Active Assignments" : "Created Assignments"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Channels & Communication */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {isStudent ? "Your Courses & Study Groups" : "Your Channels & Classes"}
            </CardTitle>
            <CardDescription>
              {isStudent 
                ? "Access your enrolled courses and study groups" 
                : "Manage your teaching channels and student communications"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myChannels.length > 0 ? (
              <div className="space-y-3">
                {myChannels.map(channel => (
                  <div key={channel.id} className="p-3 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Link to={`/channels/${channel.id}`} className="block">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium hover:text-university-primary">{channel.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {channel.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{channel.description}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{channel.members.length} member{channel.members.length !== 1 ? 's' : ''}</span>
                        {isStaff && <span className="text-blue-600">Manage →</span>}
                      </div>
                    </Link>
                  </div>
                ))}
                
                <div className="mt-4">
                  <Link to="/channels">
                    <Button variant="outline" className="w-full">
                      {isStudent ? "Browse All Courses" : "Manage All Channels"}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  {isStudent 
                    ? "You haven't joined any courses yet" 
                    : "You haven't created any channels yet"
                  }
                </p>
                <Link to="/channels">
                  <Button>
                    {isStudent ? "Browse Available Courses" : "Create Your First Channel"}
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role-specific Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isStudent ? (
                <>
                  <Link to="/assignments">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <BookOpen className="h-4 w-4" /> View Assignments
                    </Button>
                  </Link>
                  <Link to="/tutorials">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <Book className="h-4 w-4" /> Browse Tutorials
                    </Button>
                  </Link>
                  <Link to="/files">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <File className="h-4 w-4" /> Access Course Files
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/channels/create">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <Users className="h-4 w-4" /> Create New Channel
                    </Button>
                  </Link>
                  <Link to="/tutorials/create">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <BookOpen className="h-4 w-4" /> Create Tutorial
                    </Button>
                  </Link>
                  <Link to="/files/upload">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <Upload className="h-4 w-4" /> Upload Resources
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Learning Resources / Teaching Materials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              {isStudent ? "Learning Resources" : "Teaching Materials"}
            </CardTitle>
            <CardDescription>
              {isStudent 
                ? "Educational content from your instructors" 
                : "Your tutorials and educational content"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTutorials.length > 0 ? (
              <div className="space-y-3">
                {recentTutorials.map(tutorial => (
                  <Link key={tutorial.id} to={`/tutorials/${tutorial.id}`}>
                    <div className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                      <h3 className="font-medium text-sm">{tutorial.title}</h3>
                      <div className="flex gap-2 mt-2 items-center">
                        <div className="text-xs text-gray-500">
                          {new Date(tutorial.createdAt).toLocaleDateString()}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {tutorial.upvotes} upvotes
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
                
                <div className="mt-4">
                  <Link to="/tutorials">
                    <Button variant="outline" className="w-full">
                      {isStudent ? "View All Tutorials" : "Manage Tutorials"}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  {isStudent 
                    ? "No tutorials available yet" 
                    : "You haven't created any tutorials yet"
                  }
                </p>
                <Link to={isStudent ? "/tutorials" : "/tutorials/create"}>
                  <Button>
                    {isStudent ? "Browse Tutorials" : "Create Tutorial"}
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity / Files */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              {isStudent ? "Course Materials" : "Shared Resources"}
            </CardTitle>
            <CardDescription>
              {isStudent 
                ? "Recently shared files in your courses" 
                : "Files you've shared with students"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {files.length > 0 ? (
              <div className="space-y-2">
                {files.slice(0, 5).map(file => (
                  <div key={file.id} className="p-3 border rounded-md flex justify-between items-center hover:bg-gray-50 transition-colors">
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
                      {isStudent ? "Download" : "Manage"}
                    </Button>
                  </div>
                ))}
                
                <div className="mt-4">
                  <Link to="/files">
                    <Button variant="outline" className="w-full">
                      {isStudent ? "View All Course Files" : "Manage All Files"}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  {isStudent 
                    ? "No course files available yet" 
                    : "You haven't uploaded any files yet"
                  }
                </p>
                <Link to={isStudent ? "/files" : "/files/upload"}>
                  <Button>
                    {isStudent ? "Browse Files" : "Upload Files"}
                  </Button>
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
