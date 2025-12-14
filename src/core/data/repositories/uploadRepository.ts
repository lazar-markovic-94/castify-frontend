import { apiClient } from '../apiClient';

class UploadRepository {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    console.log('Uploading file:', file.name, file.type, file.size);

    const response = await apiClient.post<{ url: string }>('/api/upload/image', formData);

    console.log('Upload response:', response.data);

    // Convert relative URL to absolute URL
    const relativeUrl = response.data.url;
    return `${apiClient.defaults.baseURL}${relativeUrl}`;
  }
}

export const uploadRepository = new UploadRepository();
