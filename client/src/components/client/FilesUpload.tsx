import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  FileText, 
  Upload, 
  File, 
  Image, 
  FileArchive, 
  Download, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProjectFile {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedById: number;
  createdAt: string;
}

interface FilesUploadProps {
  files: ProjectFile[];
  orderId: number;
}

export default function FilesUpload({ files, orderId }: FilesUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileType, setFileType] = useState('brief');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userId = 1; // Tymczasowo używamy id=1, później będzie z autentykacji
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const uploadFileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      setIsUploading(true);
      setUploadError(null);
      
      try {
        const response = await fetch(`/api/client/orders/${orderId}/files?userId=${userId}`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Nie udało się przesłać pliku');
        }
        
        return await response.json();
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : 'Nie udało się przesłać pliku');
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [`/api/client/orders/${orderId}`, { userId }] });
      setIsDialogOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  });

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileInputRef.current?.files?.length) {
      setUploadError('Wybierz plik do przesłania');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);
    formData.append('fileType', fileType);
    
    uploadFileMutation.mutate(formData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string, fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['image', 'graphic'].includes(fileType) || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
      return <Image className="h-6 w-6 text-blue-500" />;
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
      return <FileArchive className="h-6 w-6 text-yellow-500" />;
    } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(extension || '')) {
      return <FileText className="h-6 w-6 text-green-500" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const getFileTypeLabel = (fileType: string) => {
    switch (fileType) {
      case 'brief':
        return 'Brief projektowy';
      case 'graphic':
        return 'Materiały graficzne';
      case 'content':
        return 'Materiały tekstowe';
      case 'reference':
        return 'Materiały referencyjne';
      case 'deliverable':
        return 'Rezultat projektu';
      default:
        return 'Inne';
    }
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Pliki projektu ({files.length})</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Prześlij plik
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Prześlij nowy plik</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFileUpload} className="space-y-4">
              {uploadError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="file">Wybierz plik</Label>
                <Input 
                  id="file" 
                  type="file" 
                  ref={fileInputRef} 
                  className="mt-1" 
                  onChange={() => setUploadError(null)}
                />
              </div>
              
              <div>
                <Label htmlFor="file-type">Typ pliku</Label>
                <Select 
                  value={fileType} 
                  onValueChange={setFileType}
                >
                  <SelectTrigger id="file-type" className="mt-1">
                    <SelectValue placeholder="Wybierz typ pliku" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brief">Brief projektowy</SelectItem>
                    <SelectItem value="graphic">Materiały graficzne</SelectItem>
                    <SelectItem value="content">Materiały tekstowe</SelectItem>
                    <SelectItem value="reference">Materiały referencyjne</SelectItem>
                    <SelectItem value="other">Inne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Anuluj
                </Button>
                <Button 
                  type="submit"
                  disabled={isUploading}
                >
                  {isUploading ? 'Przesyłanie...' : 'Prześlij plik'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {files.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border border-dashed rounded-lg">
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Brak plików. Prześlij swój pierwszy plik.</p>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="mt-4">
            Prześlij plik
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="overflow-hidden">
              <div className="flex items-center p-4">
                <div className="mr-4">
                  {getFileIcon(file.fileType, file.fileName)}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-medium text-sm truncate" title={file.fileName}>
                    {file.fileName}
                  </h4>
                  <div className="flex flex-wrap items-center text-xs text-gray-500 gap-x-2">
                    <span>{formatFileSize(file.fileSize)}</span>
                    <span>•</span>
                    <span>{getFileTypeLabel(file.fileType)}</span>
                    <span>•</span>
                    <span>Dodano: {getFormattedDate(file.createdAt)}</span>
                  </div>
                </div>
                <a 
                  href={file.fileUrl} 
                  download={file.fileName}
                  className="ml-2 p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title="Pobierz"
                >
                  <Download className="h-5 w-5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}