
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ThumbsUp, Calendar, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';

const TutorialDetail = () => {
  const { tutorialId } = useParams();
  const { tutorials, loading } = useApp();
  
  const tutorial = tutorials.find(t => t.id === tutorialId);

  if (loading) {
    return (
      <div className="container mx-auto p-4 pt-20">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading tutorial...</p>
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="container mx-auto p-4 pt-20">
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Tutorial not found</h3>
            <p className="text-gray-600 mb-4">The tutorial you're looking for doesn't exist.</p>
            <Link to="/tutorials">
              <Button>Back to Tutorials</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-20 pb-20 md:pb-4">
      <div className="mb-6">
        <Link to="/tutorials">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tutorials
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{tutorial.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>By {tutorial.authorName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(tutorial.createdAt, { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {tutorial.upvotes}
              </Badge>
            </div>
          </div>

          {tutorial.tags && tutorial.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tutorial.tags.map(tag => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {tutorial.content}
            </div>
          </div>

          {tutorial.attachments && tutorial.attachments.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Attachments</h3>
              <div className="space-y-2">
                {tutorial.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{attachment.name}</span>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialDetail;
