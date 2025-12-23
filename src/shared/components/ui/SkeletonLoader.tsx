import { motion } from 'framer-motion';
import { skeletonPulse } from '../../lib/animations';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

export const SkeletonLoader = ({ className = '', variant = 'rectangular' }: SkeletonLoaderProps) => {
  const baseClasses = 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'h-full rounded-xl',
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      variants={skeletonPulse}
      animate="pulse"
    />
  );
};

// Talent Card Skeleton
export const TalentCardSkeleton = () => {
  return (
    <div className="h-full flex flex-col overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl">
      <SkeletonLoader className="w-full h-56" />
      <div className="p-4 space-y-3">
        <SkeletonLoader variant="text" className="w-3/4 h-6" />
        <SkeletonLoader variant="text" className="w-1/2 h-4" />
        <div className="flex gap-2 mt-2">
          <SkeletonLoader variant="text" className="w-16 h-4" />
          <SkeletonLoader variant="text" className="w-20 h-4" />
        </div>
        <SkeletonLoader variant="text" className="w-full h-16" />
        <div className="flex gap-2">
          <SkeletonLoader variant="rectangular" className="w-16 h-6 rounded-full" />
          <SkeletonLoader variant="rectangular" className="w-16 h-6 rounded-full" />
          <SkeletonLoader variant="rectangular" className="w-16 h-6 rounded-full" />
        </div>
        <SkeletonLoader variant="rectangular" className="w-full h-10 mt-4" />
      </div>
    </div>
  );
};

// Message Skeleton
export const MessageSkeleton = ({ align = 'left' }: { align?: 'left' | 'right' }) => {
  return (
    <div className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}>
      <SkeletonLoader className={`${align === 'right' ? 'w-2/3' : 'w-1/2'} h-16 rounded-2xl`} />
    </div>
  );
};

// Conversation List Skeleton
export const ConversationSkeleton = () => {
  return (
    <div className="p-3 rounded-lg border border-slate-200 space-y-2">
      <div className="flex items-center gap-2">
        <SkeletonLoader variant="circular" className="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader variant="text" className="w-3/4 h-4" />
          <SkeletonLoader variant="text" className="w-1/2 h-3" />
        </div>
      </div>
    </div>
  );
};

// Profile Section Skeleton
export const ProfileSectionSkeleton = () => {
  return (
    <div className="space-y-4 p-6 bg-white rounded-xl shadow-lg">
      <SkeletonLoader variant="text" className="w-1/3 h-6" />
      <SkeletonLoader variant="text" className="w-full h-4" />
      <SkeletonLoader variant="text" className="w-full h-4" />
      <SkeletonLoader variant="text" className="w-2/3 h-4" />
    </div>
  );
};
