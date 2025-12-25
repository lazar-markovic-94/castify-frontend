import { useMutation } from '@tanstack/react-query';
import { uploadRepository } from '../data/repositories/uploadRepository';
import { ContentType } from '../domain/enums';

/**
 * Hook for uploading profile images
 */
export const useUploadProfileImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadRepository.uploadProfileImage(file),
  });
};

/**
 * Hook for uploading introduction videos
 */
export const useUploadIntroductionVideo = () => {
  return useMutation({
    mutationFn: (file: File) => uploadRepository.uploadIntroductionVideo(file),
  });
};

/**
 * Hook for uploading portfolio media
 */
export const useUploadPortfolioMedia = () => {
  return useMutation({
    mutationFn: ({
      file,
      contentType = ContentType.PORTFOLIO_ITEM,
      title,
      description,
    }: {
      file: File;
      contentType?: ContentType;
      title?: string;
      description?: string;
    }) => uploadRepository.uploadPortfolioMedia(file, contentType, title, description),
  });
};

// Legacy hooks for backward compatibility
/**
 * @deprecated Use useUploadProfileImage instead
 */
export const useUploadImage = () => {
  return useUploadProfileImage();
};

/**
 * @deprecated Use useUploadIntroductionVideo instead
 */
export const useUploadVideo = () => {
  return useUploadIntroductionVideo();
};
