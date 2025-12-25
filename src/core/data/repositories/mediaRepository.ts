import { apiClient } from '../apiClient';
import { MediaAsset, PortfolioItem, PortfolioItemWithMedia } from '../../domain/entities';
import { CreateMediaAssetRequest, AddToPortfolioRequest } from '../../domain/dtos';

class MediaRepository {
  async createMediaAsset(request: CreateMediaAssetRequest): Promise<MediaAsset> {
    const response = await apiClient.post<MediaAsset>('/api/media/assets', request);
    return response.data;
  }

  async addToPortfolio(request: AddToPortfolioRequest): Promise<PortfolioItem> {
    const response = await apiClient.post<PortfolioItem>('/api/media/portfolio', request);
    return response.data;
  }

  async removeFromPortfolio(portfolioItemId: string): Promise<void> {
    await apiClient.delete(`/api/media/portfolio/${portfolioItemId}`);
  }

  async getPortfolioItems(talentProfileId: string): Promise<PortfolioItemWithMedia[]> {
    const response = await apiClient.get<PortfolioItemWithMedia[]>(
      `/api/media/portfolio/talent/${talentProfileId}`
    );
    return response.data;
  }

  /**
   * Upload a file (image, video, or audio) and create a media asset
   * Returns the created media asset
   *
   * This method now uses the new portfolio media upload endpoint which
   * handles both file upload and media asset creation in one operation.
   *
   * @param file - The file to upload
   * @param contentType - The content type (mediaType is inferred from file MIME type)
   * @param title - Optional title for the media
   * @param description - Optional description for the media
   */
  async uploadMedia(
    file: File,
    _mediaType: string,
    contentType: string,
    title?: string,
    description?: string
  ): Promise<MediaAsset> {
    // Note: mediaType is now inferred from the file's MIME type on the backend
    // Use the new portfolio media upload endpoint
    // This handles both file upload and media asset creation
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', contentType);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);

    const response = await apiClient.post<MediaAsset>('/api/upload/portfolio-media', formData);

    // Convert relative URLs to absolute URLs
    const mediaAsset = response.data;
    if (!mediaAsset.fileUrl.startsWith('http')) {
      mediaAsset.fileUrl = `${apiClient.defaults.baseURL}${mediaAsset.fileUrl}`;
    }
    if (mediaAsset.thumbnailUrl && !mediaAsset.thumbnailUrl.startsWith('http')) {
      mediaAsset.thumbnailUrl = `${apiClient.defaults.baseURL}${mediaAsset.thumbnailUrl}`;
    }

    return mediaAsset;
  }
}

export const mediaRepository = new MediaRepository();
