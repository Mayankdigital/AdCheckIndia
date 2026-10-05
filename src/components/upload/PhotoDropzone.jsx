import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../../lib/utils';
import { useFileStore } from '../../context/FileStoreContext';

export default function PhotoDropzone({ error, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { files, setFiles } = useFileStore();
  const photoFile = files.photo;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const processFile = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10MB");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    file.previewUrl = previewUrl;
    setFiles({ ...files, photo: file });
    onChange?.(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setFiles({ ...files, photo: null });
    onChange?.(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    if (photoFile) onChange?.(photoFile);
  }, []);

  return (
    <div className="w-full">
      {!photoFile ? (
        <div
          className={`relative border-[1.5px] border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer h-full min-h-[178px] ${
            isDragging 
              ? 'border-[#E07B00] bg-[#FFF9F0]' 
              : error 
                ? 'border-red-400 bg-red-50 animate-[shake_0.5s]'
                : 'border-[#CBD5E1] bg-white hover:border-[#E07B00] hover:bg-[#FFF9F0]'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => processFile(e.target.files[0])}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${isDragging ? 'bg-white shadow-sm text-[#1B2B5E]' : error ? 'bg-red-100 text-red-500' : 'bg-[#F1F5F9] text-[#1B2B5E]'}`}>
            <Upload className="w-5 h-5" />
          </div>
          <p className="font-bold mb-1.5 text-center text-[#1B2B5E] text-[15px]">Drop your image here or click to upload</p>
          <p className="text-xs text-gray-500 font-medium text-center">JPG, PNG, WebP up to 10MB</p>
        </div>
      ) : (
        <div className="glass rounded-xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate text-sm">{photoFile.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{formatFileSize(photoFile.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-full hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <img 
            src={photoFile.previewUrl} 
            alt="Preview" 
            className="w-full rounded-lg max-h-64 object-contain bg-black/50"
          />
        </div>
      )}
      {error && (
        <div className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </div>
      )}
    </div>
  );
}
