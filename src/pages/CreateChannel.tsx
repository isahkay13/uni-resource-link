
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const CreateChannel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshData } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'year' | 'course' | 'department' | 'interest'>('course');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a channel');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter a channel name');
      return;
    }

    setLoading(true);

    try {
      // Create the channel
      const { data: channelData, error: channelError } = await supabase
        .from('channels')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          type: type,
          creator_id: user.id
        })
        .select()
        .single();

      if (channelError) throw channelError;

      // Automatically join the creator as a member
      const { error: memberError } = await supabase
        .from('channel_members')
        .insert({
          channel_id: channelData.id,
          user_id: user.id
        });

      if (memberError) throw memberError;

      toast.success('Channel created successfully!');
      refreshData();
      navigate('/channels');
    } catch (error) {
      console.error('Error creating channel:', error);
      toast.error('Failed to create channel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-20 pb-20 md:pb-4">
      <div className="mb-6">
        <Link to="/channels">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Channels
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Channel</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Channel Name *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter channel name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this channel is about..."
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="type">Channel Type *</Label>
              <Select value={type} onValueChange={(value: 'year' | 'course' | 'department' | 'interest') => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select channel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="year">Year Group</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="interest">Interest Group</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Channel'}
              </Button>
              <Link to="/channels">
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

export default CreateChannel;
