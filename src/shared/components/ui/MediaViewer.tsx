import { useEffect } from 'react';
import { PortfolioItemWithMedia } from '../../../core/domain/entities';
import { MediaType } from '../../../core/domain/enums';

interface MediaViewerProps {
  item: PortfolioItemWithMedia | null;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export const MediaViewer = ({
  item,
  onClose,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
}: MediaViewerProps) => {
  useEffect(() => {
    if (!item) return;

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) {
        onPrevious();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when viewer is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [item, onClose, onNext, onPrevious, hasNext, hasPrevious]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Close viewer"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Navigation buttons */}
      {hasPrevious && onPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="Previous item"
        >
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {hasNext && onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="Next item"
        >
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Media content */}
      <div
        className="max-w-7xl max-h-[90vh] w-full mx-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 flex items-center justify-center mb-4">
          {item.mediaAsset.mediaType === MediaType.IMAGE && (
            <img
              src={item.mediaAsset.fileUrl}
              alt={item.mediaAsset.title || 'Portfolio item'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          )}

          {item.mediaAsset.mediaType === MediaType.VIDEO && (
            <video
              src={item.mediaAsset.fileUrl}
              controls
              autoPlay
              className="max-w-full max-h-[80vh] rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          )}

          {item.mediaAsset.mediaType === MediaType.AUDIO && (
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-12 w-full max-w-2xl">
              <div className="flex flex-col items-center space-y-6">
                <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
                {item.mediaAsset.title && (
                  <h3 className="text-2xl font-bold text-white text-center">
                    {item.mediaAsset.title}
                  </h3>
                )}
                <audio src={item.mediaAsset.fileUrl} controls className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}
        </div>

        {/* Media info */}
        {(item.mediaAsset.title || item.mediaAsset.description) && (
          <div className="bg-gray-900 bg-opacity-80 rounded-lg p-4 text-white">
            {item.mediaAsset.title && (
              <h3 className="text-lg font-semibold mb-2">{item.mediaAsset.title}</h3>
            )}
            {item.mediaAsset.description && (
              <p className="text-sm text-gray-300">{item.mediaAsset.description}</p>
            )}
            <div className="flex items-center space-x-4 mt-3 text-xs text-gray-400">
              <span className="capitalize">{item.mediaAsset.mediaType.toLowerCase()}</span>
              <span>•</span>
              <span>{getContentTypeLabel(item.mediaAsset.contentType)}</span>
              {item.mediaAsset.durationSeconds && (
                <>
                  <span>•</span>
                  <span>{formatDuration(item.mediaAsset.durationSeconds)}</span>
                </>
              )}
              <span>•</span>
              <span>{formatFileSize(item.mediaAsset.fileSizeBytes)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getContentTypeLabel = (contentType: string): string => {
  switch (contentType) {
    case 'HEADSHOT':
      return 'Headshot';
    case 'PORTFOLIO_ITEM':
      return 'Portfolio Item';
    case 'DEMO_REEL':
      return 'Demo Reel';
    case 'VOICE_SAMPLE':
      return 'Voice Sample';
    default:
      return 'Media';
  }
};
