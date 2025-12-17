import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mediaRepository } from '../data/repositories';
import { CreateMediaAssetRequest, AddToPortfolioRequest } from '../domain/dtos';

/**
 * Hook to get portfolio items for a specific talent
 */
export const usePortfolioItems = (talentProfileId: string | undefined) => {
  return useQuery({
    queryKey: ['portfolioItems', talentProfileId],
    queryFn: () => mediaRepository.getPortfolioItems(talentProfileId!),
    enabled: !!talentProfileId,
  });
};

/**
 * Hook to create a media asset
 */
export const useCreateMediaAsset = () => {
  return useMutation({
    mutationFn: (request: CreateMediaAssetRequest) => mediaRepository.createMediaAsset(request),
  });
};

/**
 * Hook to upload media (file upload + create media asset)
 */
export const useUploadMedia = () => {
  return useMutation({
    mutationFn: ({
      file,
      mediaType,
      contentType,
      title,
      description,
    }: {
      file: File;
      mediaType: string;
      contentType: string;
      title?: string;
      description?: string;
    }) => mediaRepository.uploadMedia(file, mediaType, contentType, title, description),
  });
};

/**
 * Hook to add media to portfolio
 */
export const useAddToPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddToPortfolioRequest) => mediaRepository.addToPortfolio(request),
    onSuccess: () => {
      // Invalidate portfolio items queries to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
      queryClient.invalidateQueries({ queryKey: ['myTalentProfile'] });
    },
  });
};

/**
 * Hook to remove media from portfolio
 */
export const useRemoveFromPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (portfolioItemId: string) => mediaRepository.removeFromPortfolio(portfolioItemId),
    onSuccess: () => {
      // Invalidate portfolio items queries to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
      queryClient.invalidateQueries({ queryKey: ['myTalentProfile'] });
    },
  });
};

/**
 * Combined hook to upload media and add to portfolio in one operation
 */
export const useUploadAndAddToPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      mediaType,
      contentType,
      title,
      description,
      displayOrder = 0,
    }: {
      file: File;
      mediaType: string;
      contentType: string;
      title?: string;
      description?: string;
      displayOrder?: number;
    }) => {
      // First upload the media and create media asset
      const mediaAsset = await mediaRepository.uploadMedia(
        file,
        mediaType,
        contentType,
        title,
        description
      );

      // Then add it to portfolio
      const portfolioItem = await mediaRepository.addToPortfolio({
        mediaAssetId: mediaAsset.mediaAssetId,
        displayOrder,
      });

      return { mediaAsset, portfolioItem };
    },
    onSuccess: () => {
      // Invalidate portfolio items queries to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
      queryClient.invalidateQueries({ queryKey: ['myTalentProfile'] });
    },
  });
};
