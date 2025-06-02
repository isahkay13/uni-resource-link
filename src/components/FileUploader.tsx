
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
    console.log('Upload button clicked');
    if (fileInputRef.current) {
      console.log('Triggering file input click');
      fileInputRef.current.click();
    } else {
      console.error('File input ref is null');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed');
    const file = e.target.files?.[0];
    
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    console.log('File selected:', file.name, file.size);
    
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

        console.log('Uploading file:', fileAttachment);
        uploadFile(fileAttachment);
        
        if (onFileUploaded) {
          onFileUploaded(`file_${Date.now()}`);
        }
        
        toast.success('File uploaded successfully.');
      } else {
        toast.error('You must be logged in to upload files.');
      }
      
      setUploading(false);
      
      // Reset the input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="*/*"
        multiple={false}
      />
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium">Choose a file to upload</p>
          <p className="text-sm text-gray-500">
            Click the button below to select a file from your device
          </p>
        </div>
      </div>
      
      <Button 
        onClick={handleUpload} 
        disabled={uploading}
        className="flex items-center gap-2"
        size="lg"
      >
        <Upload className="h-4 w-4" />
        {uploading ? 'Uploading...' : 'Select File from Device'}
      </Button>
      
      <p className="text-xs text-gray-500">
        Maximum file size: {formatBytes(maxSize)}
      </p>
    </div>
  );
};

export default FileUploader;
