

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { FileText, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((selectedFile: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Please upload a PDF, Word, or PowerPoint file');
      return;
    }

    setFile(selectedFile);
    onFileSelect(selectedFile);
  }, [onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [handleFileChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  }, [handleFileChange]);

  const removeFile = useCallback(() => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <Card className={`p-6 ${dragActive ? 'border-primary border-2' : ''} transition-all duration-200`}>
      <div 
        className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent/50 transition-colors"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          onChange={handleInputChange}
          className="hidden"
        />
        
        {!file ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className="h-12 w-12 text-primary animate-bounce-sm" />
            </div>
            <h3 className="text-lg font-medium">Drag & drop your file here</h3>
            <p className="text-sm text-muted-foreground">
              Support for PDF, PPT, and Word documents
            </p>
            <Button onClick={openFileDialog} className="mt-2">
              Select File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <span className="font-medium">{file.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={removeFile}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FileUploader;
