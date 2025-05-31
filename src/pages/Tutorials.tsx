
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, Plus, Search, ThumbsUp, MessageSquare, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';

const Tutorials = () => {
  const { user } = useAuth();
  const { tutorials, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const isStaff = user?.role === 'academic' || user?.role === 'nonacademic';

  // Get all unique tags from tutorials
  const allTags = Array.from(new Set(tutorials.flatMap(tutorial => tutorial.tags || [])));

  // Filter tutorials based on search and tag
  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || tutorial.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <div className="container mx-auto p-4 pt-20">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading tutorials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-20 pb-20 md:pb-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tutorials & Learning Resources</h1>
            <p className="text-gray-600">
              Discover educational content created by faculty and students
            </p>
          </div>
          {isStaff && (
            <Link to="/tutorials/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Tutorial
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tutorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedTag === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag('')}
            >
              All Topics
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {filteredTutorials.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No tutorials found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedTag
                ? "Try adjusting your search criteria"
                : "No tutorials have been created yet"}
            </p>
            {isStaff && (
              <Link to="/tutorials/create">
                <Button>Create the first tutorial</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {tutorial.upvotes}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">
                  {tutorial.content.substring(0, 150)}...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-4">
                  {tutorial.tags?.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {tutorial.tags && tutorial.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{tutorial.tags.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>By {tutorial.authorName}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(tutorial.createdAt), { addSuffix: true })}
                  </div>
                </div>

                <Link to={`/tutorials/${tutorial.id}`}>
                  <Button variant="outline" className="w-full">
                    Read Tutorial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tutorials;
