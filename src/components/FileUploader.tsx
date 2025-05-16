
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface FileUploaderProps {
  onFileUploaded?: (fileId: string) => void;
  maxSize?: number; // in bytes, defaults to 100MB
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileUploaded,
  maxSize = 100 * 1024 * 1024 // 100MB default
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { uploadFile } = useApp();
  const { user } = useAuth();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (file.size > maxSize) {
      toast.error(`File too large. Maximum size is ${formatBytes(maxSize)}.`);
      return;
    }

    setUploading(true);

    // In a real app, this would upload to a server
    setTimeout(() => {
      // Mock file upload
      const fileUrl = URL.createObjectURL(file);
      
      if (user) {
        const fileAttachment = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: fileUrl,
          uploaderId: user.id,
          uploadDate: new Date()
        };

        uploadFile(fileAttachment);
        
        if (onFileUploaded) {
          onFileUploaded(`file_${Date.now()}`);
        }
        
        toast.success('File uploaded successfully.');
      } else {
        toast.error('You must be logged in to upload files.');
      }
      
      setUploading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center">
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button 
        onClick={handleUpload} 
        disabled={uploading}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        {uploading ? 'Uploading...' : 'Upload File'}
      </Button>
      <p className="text-xs text-gray-500 mt-2">
        Maximum file size: {formatBytes(maxSize)}
      </p>
    </div>
  );
};

export default FileUploader;
