import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { AlertModal } from './AlertModal';
import { MediaType, ContentType } from '../../../core/domain/enums';

interface MediaUploadProps {
  onFileSelect: (file: File, metadata: MediaUploadMetadata) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  className?: string;
}

export interface MediaUploadMetadata {
  mediaType: MediaType;
  contentType: ContentType;
  title?: string;
  description?: string;
}

export const MediaUpload = ({
  onFileSelect,
  acceptedTypes = ['image/*', 'video/*', 'audio/*'],
  maxSizeMB = 100,
  className,
}: MediaUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.IMAGE);
  const [contentType, setContentType] = useState<ContentType>(ContentType.PORTFOLIO_ITEM);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setAlertModal({
        isOpen: true,
        title: 'File Too Large',
        message: `File size exceeds ${maxSizeMB}MB limit. Please select a smaller file.`,
      });
      return;
    }

    // Detect media type based on file MIME type
    let detectedMediaType: MediaType;
    if (file.type.startsWith('image/')) {
      detectedMediaType = MediaType.IMAGE;
    } else if (file.type.startsWith('video/')) {
      detectedMediaType = MediaType.VIDEO;
    } else if (file.type.startsWith('audio/')) {
      detectedMediaType = MediaType.AUDIO;
    } else {
      setAlertModal({
        isOpen: true,
        title: 'Unsupported File Type',
        message: 'This file type is not supported. Please select an image, video, or audio file.',
      });
      return;
    }

    setSelectedFile(file);
    setMediaType(detectedMediaType);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    onFileSelect(selectedFile, {
      mediaType,
      contentType,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
    });

    // Reset form
    setSelectedFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setMediaType(MediaType.IMAGE);
    setContentType(ContentType.PORTFOLIO_ITEM);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {!selectedFile ? (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-white'
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="text-lg font-medium text-gray-700">Drag and drop your media here</p>
              <p className="text-sm text-gray-500 mt-1">or click to browse (max {maxSizeMB}MB)</p>
              <p className="text-xs text-gray-400 mt-2">Supports images, videos, and audio files</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 border rounded-lg p-6 bg-white">
          {/* Preview */}
          {preview && (
            <div className="flex justify-center">
              <img src={preview} alt="Preview" className="max-h-64 rounded-lg object-contain" />
            </div>
          )}
          {!preview && mediaType === MediaType.VIDEO && (
            <div className="flex justify-center p-8 bg-gray-100 rounded-lg">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
          )}
          {!preview && mediaType === MediaType.AUDIO && (
            <div className="flex justify-center p-8 bg-gray-100 rounded-lg">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
            </div>
          )}

          {/* File info */}
          <div className="text-sm text-gray-600">
            <p className="font-medium">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>

          {/* Metadata form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={ContentType.PORTFOLIO_ITEM}>Portfolio Item</option>
                <option value={ContentType.HEADSHOT}>Headshot</option>
                <option value={ContentType.DEMO_REEL}>Demo Reel</option>
                <option value={ContentType.VOICE_SAMPLE}>Voice Sample</option>
                <option value={ContentType.OTHER}>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for this media"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>Upload to Portfolio</Button>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        variant="error"
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
      />
    </div>
  );
};
