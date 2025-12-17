import { useState } from 'react';
import { PortfolioItemWithMedia } from '../../../core/domain/entities';
import { MediaType } from '../../../core/domain/enums';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface PortfolioGalleryProps {
  items: PortfolioItemWithMedia[];
  onItemClick?: (item: PortfolioItemWithMedia) => void;
  onItemRemove?: (portfolioItemId: string) => void;
  isOwner?: boolean;
  className?: string;
}

export const PortfolioGallery = ({
  items,
  onItemClick,
  onItemRemove,
  isOwner = false,
  className,
}: PortfolioGalleryProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-4 text-gray-500">No portfolio items yet</p>
        {isOwner && (
          <p className="text-sm text-gray-400 mt-2">
            Upload your first media to showcase your work
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.portfolioItemId}
          className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-100 aspect-square"
          onMouseEnter={() => setHoveredId(item.portfolioItemId)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => onItemClick?.(item)}
        >
          {/* Media Content */}
          {item.mediaAsset.mediaType === MediaType.IMAGE && (
            <img
              src={item.mediaAsset.fileUrl}
              alt={item.mediaAsset.title || 'Portfolio item'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}

          {item.mediaAsset.mediaType === MediaType.VIDEO && (
            <div className="relative w-full h-full">
              {item.mediaAsset.thumbnailUrl ? (
                <img
                  src={item.mediaAsset.thumbnailUrl}
                  alt={item.mediaAsset.title || 'Video thumbnail'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
              )}
              {/* Play icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          )}

          {item.mediaAsset.mediaType === MediaType.AUDIO && (
            <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 p-6">
              <svg className="w-20 h-20 text-purple-600 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
              {item.mediaAsset.durationSeconds && (
                <p className="text-sm font-medium text-purple-700">
                  {formatDuration(item.mediaAsset.durationSeconds)}
                </p>
              )}
            </div>
          )}

          {/* Hover overlay with info */}
          <div
            className={cn(
              'absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 flex flex-col justify-between p-4',
              hoveredId === item.portfolioItemId ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="text-white">
              {item.mediaAsset.title && (
                <h4 className="font-medium text-sm line-clamp-2">{item.mediaAsset.title}</h4>
              )}
              {item.mediaAsset.description && (
                <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                  {item.mediaAsset.description}
                </p>
              )}
            </div>

            {isOwner && onItemRemove && (
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to remove this item from your portfolio?')) {
                      onItemRemove(item.portfolioItemId);
                    }
                  }}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          {/* Content type badge */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-medium bg-black bg-opacity-60 text-white rounded">
              {getContentTypeLabel(item.mediaAsset.contentType)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getContentTypeLabel = (contentType: string): string => {
  switch (contentType) {
    case 'HEADSHOT':
      return 'Headshot';
    case 'PORTFOLIO_ITEM':
      return 'Portfolio';
    case 'DEMO_REEL':
      return 'Demo Reel';
    case 'VOICE_SAMPLE':
      return 'Voice';
    default:
      return 'Media';
  }
};
