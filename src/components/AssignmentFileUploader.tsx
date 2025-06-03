
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '../context/AuthContext';

interface AssignmentFileUploaderProps {
  onFileUploaded?: (fileData: any) => void;
  maxSize?: number;
  allowedTypes?: string[];
}

const AssignmentFileUploader: React.FC<AssignmentFileUploaderProps> = ({ 
  onFileUploaded,
  maxSize = 50 * 1024 * 1024, // 50MB default for assignments
  allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
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

    if (!allowedTypes.includes(file.type)) {
      toast.error('File type not allowed. Please upload PDF, Word, or text documents.');
      return;
    }

    setUploading(true);

    // Mock file upload for assignment submission
    setTimeout(() => {
      const fileUrl = URL.createObjectURL(file);
      
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        uploadDate: new Date()
      };

      setUploadedFile(fileData);
      
      if (onFileUploaded) {
        onFileUploaded(fileData);
      }
      
      toast.success('Assignment file uploaded successfully.');
      setUploading(false);
    }, 1000);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
      />
      
      {!uploadedFile ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Upload your assignment file
          </p>
          <Button 
            onClick={handleUpload} 
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Choose File'}
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Supported: PDF, Word, Text files (max {formatBytes(maxSize)})
          </p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">{formatBytes(uploadedFile.size)}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentFileUploader;
