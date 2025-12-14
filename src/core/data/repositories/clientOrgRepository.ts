import { apiClient } from '../apiClient';
import { ClientOrg } from '../../domain/entities';
import { CreateClientOrgRequest, UpdateClientOrgRequest } from '../../domain/dtos';

class ClientOrgRepository {
  async createOrganization(request: CreateClientOrgRequest): Promise<ClientOrg> {
    const response = await apiClient.post<ClientOrg>('/api/clients/organization', request);
    return response.data;
  }

  async updateOrganization(request: UpdateClientOrgRequest): Promise<ClientOrg> {
    const response = await apiClient.put<ClientOrg>('/api/clients/organization', request);
    return response.data;
  }

  async getMyOrganization(): Promise<ClientOrg> {
    const response = await apiClient.get<ClientOrg>('/api/clients/my-organization');
    return response.data;
  }

  async getOrganizationById(clientOrgId: string): Promise<ClientOrg> {
    const response = await apiClient.get<ClientOrg>(`/api/clients/organization/${clientOrgId}`);
    return response.data;
  }

  async getOrganizationByUserId(userId: string): Promise<ClientOrg> {
    const response = await apiClient.get<ClientOrg>(`/api/clients/organization/user/${userId}`);
    return response.data;
  }
}

export const clientOrgRepository = new ClientOrgRepository();
