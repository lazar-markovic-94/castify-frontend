import { apiClient } from '../apiClient';
import { TalentProfile } from '../../domain/entities';
import {
  CreateTalentProfileRequest,
  UpdateLocationRequest,
  UpdateLanguagesRequest,
  UpdateTagsRequest,
  UpdateCapabilitiesRequest,
  UpdateSocialLinksRequest,
  TalentSearchRequest,
  PagedResult,
} from '../../domain/dtos';

class TalentRepository {
  async createProfile(request: CreateTalentProfileRequest): Promise<TalentProfile> {
    const response = await apiClient.post<TalentProfile>('/api/talents/profile', request);
    return response.data;
  }

  async getMyProfile(): Promise<TalentProfile> {
    const response = await apiClient.get<TalentProfile>('/api/talents/my-profile');
    return response.data;
  }

  async getProfileById(talentProfileId: string): Promise<TalentProfile> {
    const response = await apiClient.get<TalentProfile>(`/api/talents/${talentProfileId}`);
    return response.data;
  }

  async getProfileByUserId(userId: string): Promise<TalentProfile> {
    const response = await apiClient.get<TalentProfile>(`/api/talents/user/${userId}`);
    return response.data;
  }

  async updateLocation(request: UpdateLocationRequest): Promise<TalentProfile> {
    const response = await apiClient.put<TalentProfile>('/api/talents/location', request);
    return response.data;
  }

  async updateLanguages(request: UpdateLanguagesRequest): Promise<TalentProfile> {
    const response = await apiClient.put<TalentProfile>('/api/talents/languages', request);
    return response.data;
  }

  async updateTags(request: UpdateTagsRequest): Promise<TalentProfile> {
    const response = await apiClient.put<TalentProfile>('/api/talents/tags', request);
    return response.data;
  }

  async updateCapabilities(request: UpdateCapabilitiesRequest): Promise<TalentProfile> {
    const response = await apiClient.put<TalentProfile>('/api/talents/capabilities', request);
    return response.data;
  }

  async updateSocialLinks(request: UpdateSocialLinksRequest): Promise<TalentProfile> {
    const response = await apiClient.put<TalentProfile>('/api/talents/social-links', request);
    return response.data;
  }

  async searchTalents(request: TalentSearchRequest): Promise<PagedResult<TalentProfile>> {
    const response = await apiClient.post<PagedResult<TalentProfile>>('/api/talents/search', request);
    return response.data;
  }

  async updateProfileImage(profileImageUrl: string): Promise<TalentProfile> {
    const response = await apiClient.put<TalentProfile>('/api/talents/profile-image', { profileImageUrl });
    return response.data;
  }
}

export const talentRepository = new TalentRepository();
