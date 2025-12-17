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
   */
  async uploadMedia(file: File, mediaType: string, contentType: string, title?: string, description?: string): Promise<MediaAsset> {
    // First upload the file
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await apiClient.post<{ url: string }>('/api/upload/image', formData);
    const fileUrl = `${apiClient.defaults.baseURL}${uploadResponse.data.url}`;

    // Then create the media asset
    const mediaAssetRequest: CreateMediaAssetRequest = {
      mediaType,
      contentType,
      fileUrl,
      title,
      description,
      fileSizeBytes: file.size,
    };

    return this.createMediaAsset(mediaAssetRequest);
  }
}

export const mediaRepository = new MediaRepository();
