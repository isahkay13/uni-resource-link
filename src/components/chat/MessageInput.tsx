
import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface MessageInputProps {
  channelId: string;
  userId: string;
}

const MessageInput = ({ channelId, userId }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !channelId || !userId) return;
    
    setIsSending(true);
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          channel_id: channelId,
          user_id: userId,
          content: newMessage.trim()
        });
      
      if (error) throw error;
      
      setNewMessage('');
      // Send typing stopped event
      await sendTypingEvent(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const sendTypingEvent = async (isTyping: boolean) => {
    try {
      await supabase.channel('typing').send({
        type: 'broadcast',
        event: isTyping ? 'typing' : 'typing_stopped',
        payload: { 
          channel_id: channelId, 
          user_id: userId 
        }
      });
    } catch (error) {
      console.error('Error sending typing event:', error);
    }
  };

  const handleTyping = () => {
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing event
    sendTypingEvent(true);

    // Set timeout to send typing stopped event after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingEvent(false);
    }, 2000);
  };

  useEffect(() => {
    // Clean up timeout on unmount
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        sendTypingEvent(false);
      }
    };
  }, []);

  return (
    <form onSubmit={sendMessage} className="flex gap-2">
      <Textarea 
        value={newMessage}
        onChange={(e) => {
          setNewMessage(e.target.value);
          if (e.target.value.trim()) {
            handleTyping();
          }
        }}
        placeholder="Type your message..."
        className="min-h-[50px] resize-none"
        disabled={isSending}
      />
      <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default MessageInput;
