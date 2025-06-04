import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  File, 
  Upload, 
  Search, 
  Download, 
  Filter,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/components/ui/sonner';
import FileUploader from '../components/FileUploader';

const Files = () => {
  const { user } = useAuth();
  const { files, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (fileType.startsWith('video/')) return <Video className="h-5 w-5" />;
    if (fileType.startsWith('audio/')) return <Music className="h-5 w-5" />;
    if (fileType.includes('zip') || fileType.includes('archive')) return <Archive className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeCategory = (fileType: string) => {
    if (fileType.startsWith('image/')) return 'Images';
    if (fileType.startsWith('video/')) return 'Videos';
    if (fileType.startsWith('audio/')) return 'Audio';
    if (fileType.includes('pdf')) return 'PDFs';
    if (fileType.includes('document') || fileType.includes('word')) return 'Documents';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'Spreadsheets';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'Presentations';
    return 'Other';
  };

  const handleFileDownload = (file: any) => {
    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Downloading ${file.name}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file. Please try again.');
    }
  };

  const handleFileUploaded = () => {
    setUploadDialogOpen(false);
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = fileTypeFilter === 'all' || getFileTypeCategory(file.type).toLowerCase() === fileTypeFilter;
    return matchesSearch && matchesType;
  });

  const fileTypeCategories = Array.from(new Set(files.map(file => getFileTypeCategory(file.type))));

  if (loading) {
    return (
      <div className="container mx-auto p-4 pt-20">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-20 pb-20 md:pb-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Course Files & Resources</h1>
            <p className="text-gray-600">
              Access and manage educational materials and resources
            </p>
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload File</DialogTitle>
                <DialogDescription>
                  Choose a file to upload to the course resources.
                </DialogDescription>
              </DialogHeader>
              <FileUploader onFileUploaded={handleFileUploaded} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All File Types</SelectItem>
              {fileTypeCategories.map(category => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No files found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || fileTypeFilter !== 'all'
                ? "Try adjusting your search criteria"
                : "No files have been uploaded yet"}
            </p>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload your first file
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                  <DialogDescription>
                    Choose a file to upload to the course resources.
                  </DialogDescription>
                </DialogHeader>
                <FileUploader onFileUploaded={handleFileUploaded} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-md">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium truncate">
                      {file.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {formatFileSize(file.size)} • {getFileTypeCategory(file.type)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {file.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {file.description}
                  </p>
                )}
                
                <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                  <span>By {file.uploaderName}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(file.uploadDate), { addSuffix: true })}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleFileDownload(file)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  {user?.id === file.uploaderId && (
                    <Button variant="ghost" size="sm">
                      Manage
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Files;
