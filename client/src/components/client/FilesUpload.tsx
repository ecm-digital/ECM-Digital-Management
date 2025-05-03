import React, { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, AlertCircle, Upload, File, Download, Trash2, FileText, FileImage, FileArchive } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDistance, format } from "date-fns";
import { pl } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";

interface ProjectFile {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedById: number;
  createdAt: string;
  uploaderName?: string;
}

interface FilesUploadProps {
  orderId: number | string;
}

export default function FilesUpload({ orderId }: FilesUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<ProjectFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: [`/api/client/orders/${orderId}/files`],
    retry: false,
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      setIsUploading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.open('POST', `/api/client/orders/${orderId}/files`);
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        };
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.response);
              resolve(response);
            } catch (e) {
              reject(new Error("Nie udało się przetworzyć odpowiedzi"));
            }
          } else {
            reject(new Error(`Błąd ${xhr.status}: ${xhr.statusText}`));
          }
        };
        
        xhr.onerror = () => {
          reject(new Error("Wystąpił błąd sieciowy"));
        };
        
        xhr.send(formData);
      });
    },
    onSuccess: () => {
      setSelectedFile(null);
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast({
        title: "Plik został przesłany",
        description: "Twój plik został pomyślnie dodany do zamówienia.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/client/orders/${orderId}/files`] });
    },
    onError: (error) => {
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: "Błąd podczas przesyłania pliku",
        description: error.message || "Spróbuj ponownie później.",
        variant: "destructive",
      });
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: number) => {
      const response = await fetch(`/api/client/orders/${orderId}/files/${fileId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Nie udało się usunąć pliku");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setFileToDelete(null);
      toast({
        title: "Plik został usunięty",
        description: "Plik został pomyślnie usunięty z zamówienia.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/client/orders/${orderId}/files`] });
    },
    onError: (error) => {
      toast({
        title: "Błąd podczas usuwania pliku",
        description: error.message || "Spróbuj ponownie później.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadFileMutation.mutate(selectedFile);
    }
  };

  const handleDeleteFile = () => {
    if (fileToDelete) {
      deleteFileMutation.mutate(fileToDelete.id);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return <FileImage className="h-6 w-6" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="h-6 w-6" />;
    } else if (fileType.includes('zip') || fileType.includes('rar')) {
      return <FileArchive className="h-6 w-6" />;
    } else {
      return <File className="h-6 w-6" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Ładowanie plików...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="mt-4 text-muted-foreground">Wystąpił błąd podczas ładowania plików.</p>
      </div>
    );
  }

  const files = data?.files || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pliki projektu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 mb-6">
            {files.length > 0 ? (
              <div className="grid gap-4">
                {files.map((file: ProjectFile) => (
                  <div key={file.id} className="p-4 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      {getFileIcon(file.fileType)}
                      <div className="ml-4">
                        <p className="font-medium">{file.fileName}</p>
                        <div className="flex text-xs text-muted-foreground mt-1 gap-2">
                          <span>{formatFileSize(file.fileSize)}</span>
                          <span>•</span>
                          <span>Przesłano {formatDistance(new Date(file.createdAt), new Date(), { addSuffix: true, locale: pl })}</span>
                          {file.uploaderName && (
                            <>
                              <span>•</span>
                              <span>Przez: {file.uploaderName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <a href={file.fileUrl} download target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setFileToDelete(file)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Brak plików. Dodaj pliki do projektu!</p>
              </div>
            )}
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Prześlij nowy plik</h3>
            <div className="space-y-4">
              <Input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              
              {isUploading && (
                <div className="w-full bg-muted rounded-full h-2.5 my-2">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  <p className="text-xs text-right mt-1">{uploadProgress}%</p>
                </div>
              )}
              
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full flex items-center gap-2"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isUploading ? "Przesyłanie..." : "Prześlij plik"}
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Dozwolone typy plików: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, ZIP, RAR (max. 10MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog potwierdzenia usunięcia pliku */}
      <Dialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usunąć plik?</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć plik "{fileToDelete?.fileName}"? Tej operacji nie można cofnąć.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFileToDelete(null)}>
              Anuluj
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteFile}
              disabled={deleteFileMutation.isPending}
            >
              {deleteFileMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Usuwanie...
                </>
              ) : 'Usuń plik'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}