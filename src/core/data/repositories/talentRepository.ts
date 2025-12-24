import { apiClient, publicApiClient } from '../apiClient';
import { TalentProfile } from '../../domain/entities';
import {
  CreateTalentProfileRequest,
  UpdatePrimaryLocationRequest,
  AddGeoAreaRequest,
  RemoveGeoAreaRequest,
  UpdateGeoAreasRequest,
  UpdateLanguagesRequest,
  UpdateTagsRequest,
  UpdateCapabilitiesRequest,
  UpdateSocialLinksRequest,
  TalentSearchRequest,
  PagedResult,
  AvailableTagsResponse,
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
    // Use public client - no authentication required
    const response = await publicApiClient.get<TalentProfile>(`/api/talents/${talentProfileId}`);
    return response.data;
  }

  async getProfileByUserId(userId: string): Promise<TalentProfile> {
    // Use public client - no authentication required
    const response = await publicApiClient.get<TalentProfile>(`/api/talents/user/${userId}`);
    return response.data;
  }

  async updatePrimaryLocation(request: UpdatePrimaryLocationRequest): Promise<TalentProfile> {
    const response = await apiClient.put<TalentProfile>('/api/talents/primary-location', request);
    return response.data;
  }

  async addGeoArea(request: AddGeoAreaRequest): Promise<TalentProfile> {
    const response = await apiClient.post<TalentProfile>('/api/talents/geo-areas', request);
    return response.data;
  }

  async removeGeoArea(request: RemoveGeoAreaRequest): Promise<TalentProfile> {
    const response = await apiClient.delete<TalentProfile>('/api/talents/geo-areas', {
      data: request,
    });
    return response.data;
  }

  async updateGeoAreas(request: UpdateGeoAreasRequest): Promise<TalentProfile> {
    const response = await apiClient.put<TalentProfile>('/api/talents/geo-areas', request);
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
    // Use public client - no authentication required
    const response = await publicApiClient.post<PagedResult<TalentProfile>>(
      '/api/talents/search',
      request
    );
    return response.data;
  }

  async updateProfileImage(profileImageUrl: string): Promise<TalentProfile> {
    const response = await apiClient.put<TalentProfile>('/api/talents/profile-image', {
      profileImageUrl,
    });
    return response.data;
  }

  async getAvailableTags(): Promise<AvailableTagsResponse> {
    // Use public client - no authentication required
    const response = await publicApiClient.get<AvailableTagsResponse>(
      '/api/talents/available-tags'
    );
    return response.data;
  }
}

export const talentRepository = new TalentRepository();
