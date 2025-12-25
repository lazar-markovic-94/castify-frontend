import { apiClient } from '../apiClient';
import { ContentType, MediaType } from '../../../core/domain/enums';

interface MediaAssetResponse {
  mediaAssetId: string;
  uploadedByUserId: string;
  mediaType: MediaType;
  contentType: ContentType;
  fileUrl: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  durationSeconds?: number;
  fileSizeBytes: number;
  uploadedAt: string;
}

class UploadRepository {
  /**
   * Upload a profile image
   */
  async uploadProfileImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    console.log('Uploading profile image:', file.name, file.type, file.size);

    const response = await apiClient.post<{ url: string }>('/api/upload/profile-image', formData);

    console.log('Profile image upload response:', response.data);

    // Convert relative URL to absolute URL pointing to backend
    const relativeUrl = response.data.url;
    return `${apiClient.defaults.baseURL}${relativeUrl}`;
  }

  /**
   * Upload an introduction video
   */
  async uploadIntroductionVideo(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    console.log('Uploading introduction video:', file.name, file.type, file.size);

    const response = await apiClient.post<{ url: string }>(
      '/api/upload/introduction-video',
      formData
    );

    console.log('Introduction video upload response:', response.data);

    // Convert relative URL to absolute URL pointing to backend
    const relativeUrl = response.data.url;
    return `${apiClient.defaults.baseURL}${relativeUrl}`;
  }

  /**
   * Upload portfolio media (images, videos, or audio)
   */
  async uploadPortfolioMedia(
    file: File,
    contentType: ContentType = ContentType.PORTFOLIO_ITEM,
    title?: string,
    description?: string
  ): Promise<MediaAssetResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', contentType);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);

    console.log('Uploading portfolio media:', file.name, file.type, file.size, contentType);

    const response = await apiClient.post<MediaAssetResponse>(
      '/api/upload/portfolio-media',
      formData
    );

    console.log('Portfolio media upload response:', response.data);

    // Convert relative URL to absolute URL for fileUrl
    const mediaAsset = response.data;
    mediaAsset.fileUrl = `${apiClient.defaults.baseURL}${mediaAsset.fileUrl}`;
    if (mediaAsset.thumbnailUrl) {
      mediaAsset.thumbnailUrl = `${apiClient.defaults.baseURL}${mediaAsset.thumbnailUrl}`;
    }

    return mediaAsset;
  }

  // Legacy methods for backward compatibility
  /**
   * @deprecated Use uploadProfileImage instead
   */
  async uploadImage(file: File): Promise<string> {
    return this.uploadProfileImage(file);
  }

  /**
   * @deprecated Use uploadIntroductionVideo instead
   */
  async uploadVideo(file: File): Promise<string> {
    return this.uploadIntroductionVideo(file);
  }
}

export const uploadRepository = new UploadRepository();
