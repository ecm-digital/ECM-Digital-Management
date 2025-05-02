import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  onFileUpload: (file: File | null) => void;
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const uploadedFile = e.dataTransfer.files[0];
      validateAndSetFile(uploadedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      validateAndSetFile(uploadedFile);
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const validateAndSetFile = (uploadedFile: File) => {
    // Check file size (10MB max)
    if (uploadedFile.size > 10 * 1024 * 1024) {
      alert("Plik jest zbyt duży. Maksymalny rozmiar to 10MB.");
      return;
    }

    // Check file type
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(uploadedFile.type)) {
      alert("Nieobsługiwany format pliku. Dozwolone formaty: PDF, DOC, DOCX, JPG, PNG.");
      return;
    }

    // Set file
    setFile(uploadedFile);
    onFileUpload(uploadedFile);
  };

  const removeFile = () => {
    setFile(null);
    onFileUpload(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />

      {!file ? (
        <div
          className={`border-2 border-dashed ${
            dragActive ? "border-primary" : "border-gray-300"
          } rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="h-10 w-10 mx-auto text-dark-light mb-2" />
          <p className="text-dark-light mb-1">Przeciągnij i upuść pliki lub</p>
          <button className="text-primary font-medium">przeglądaj pliki</button>
          <p className="text-xs text-dark-light mt-2">
            Maksymalny rozmiar: 10MB, Format: PDF, DOC, JPG
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium text-sm text-dark truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs text-dark-light">
                  {(file.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-dark-light hover:text-dark p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
