
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  const [dragOver, setDragOver] = useState(false);
  const { uploadFile } = useApp();
  const { user } = useAuth();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = async (file: File) => {
    if (file.size > maxSize) {
      toast.error(`File too large. Maximum size is ${formatBytes(maxSize)}.`);
      return;
    }

    if (!user) {
      toast.error('You must be logged in to upload files.');
      return;
    }

    setUploading(true);

    try {
      // Create a file URL for preview/download
      const fileUrl = URL.createObjectURL(file);
      
      const fileAttachment = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        uploaderId: user.id,
        uploadDate: new Date(),
        description: `Uploaded by ${user.name}`
      };

      await uploadFile(fileAttachment);
      
      if (onFileUploaded) {
        onFileUploaded(`file_${Date.now()}`);
      }
      
      toast.success('File uploaded successfully.');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This uploader accesses your device's file system through your browser's built-in file picker. 
          No additional permissions are required.
        </AlertDescription>
      </Alert>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-university-primary bg-university-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="*/*"
        />
        
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-700">
            {dragOver ? 'Drop file here' : 'Upload a file'}
          </p>
          <p className="text-sm text-gray-500">
            Drag and drop a file here, or click to browse
          </p>
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={uploading}
          className="mt-4"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Choose File'}
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          Maximum file size: {formatBytes(maxSize)}
        </p>
      </div>
    </div>
  );
};

export default FileUploader;
