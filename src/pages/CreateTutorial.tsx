
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import FileUploader from '../components/FileUploader';

const CreateTutorial = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshData } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileUploaded = (fileId: string) => {
    setUploadDialogOpen(false);
    toast.success('File attached to tutorial!');
    // In a real implementation, you'd track the file IDs
    setAttachedFiles([...attachedFiles, { id: fileId, name: `File ${fileId}` }]);
  };

  const removeAttachment = (fileId: string) => {
    setAttachedFiles(attachedFiles.filter(file => file.id !== fileId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a tutorial');
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('tutorials')
        .insert({
          title: title.trim(),
          content: content.trim(),
          author_id: user.id,
          tags: tags,
          is_published: true
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Tutorial created successfully!');
      refreshData();
      navigate('/tutorials');
    } catch (error) {
      console.error('Error creating tutorial:', error);
      toast.error('Failed to create tutorial');
    } finally {
      setLoading(false);
    }
  };

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

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Tutorial</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter tutorial title"
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your tutorial content here..."
                className="min-h-[300px]"
                required
              />
            </div>

            <div>
              <Label>Attachments</Label>
              <div className="space-y-2">
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Add File Attachment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Attachment</DialogTitle>
                      <DialogDescription>
                        Choose a file to attach to this tutorial.
                      </DialogDescription>
                    </DialogHeader>
                    <FileUploader onFileUploaded={handleFileUploaded} />
                  </DialogContent>
                </Dialog>

                {attachedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Attached Files:</Label>
                    {attachedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="tags"
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-gray-200"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Tutorial'}
              </Button>
              <Link to="/tutorials">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTutorial;
