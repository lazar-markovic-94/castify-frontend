import { apiClient } from '../apiClient';
import { Collaboration } from '../../domain/entities';
import { CollaborationStatus } from '../../domain/enums';
import {
  CreateCollaborationRequest,
  CollaborationsResponse,
} from '../../domain/dtos';

class CollaborationRepository {
  /**
   * Create a new collaboration proposal (CLIENT only)
   */
  async createCollaboration(request: CreateCollaborationRequest): Promise<Collaboration> {
    const response = await apiClient.post<Collaboration>('/api/collaborations', request);
    return response.data;
  }

  /**
   * Get a specific collaboration by ID
   */
  async getCollaborationById(collaborationId: string): Promise<Collaboration> {
    const response = await apiClient.get<Collaboration>(`/api/collaborations/${collaborationId}`);
    return response.data;
  }

  /**
   * Get collaborations for the current client user
   */
  async getClientCollaborations(status?: CollaborationStatus): Promise<CollaborationsResponse> {
    const response = await apiClient.get<CollaborationsResponse>('/api/collaborations/client/me', {
      params: status ? { status } : undefined,
    });
    return response.data;
  }

  /**
   * Get collaborations for the current talent user
   */
  async getTalentCollaborations(status?: CollaborationStatus): Promise<CollaborationsResponse> {
    const response = await apiClient.get<CollaborationsResponse>('/api/collaborations/talent/me', {
      params: status ? { status } : undefined,
    });
    return response.data;
  }

  /**
   * Accept a collaboration proposal (TALENT only)
   */
  async acceptCollaboration(collaborationId: string): Promise<Collaboration> {
    const response = await apiClient.post<Collaboration>(
      `/api/collaborations/${collaborationId}/accept`
    );
    return response.data;
  }

  /**
   * Decline a collaboration proposal (TALENT only)
   */
  async declineCollaboration(collaborationId: string): Promise<Collaboration> {
    const response = await apiClient.post<Collaboration>(
      `/api/collaborations/${collaborationId}/decline`
    );
    return response.data;
  }

  /**
   * Start work on an accepted collaboration
   */
  async startCollaboration(collaborationId: string): Promise<Collaboration> {
    const response = await apiClient.post<Collaboration>(
      `/api/collaborations/${collaborationId}/start`
    );
    return response.data;
  }

  /**
   * Complete an in-progress collaboration
   */
  async completeCollaboration(collaborationId: string): Promise<Collaboration> {
    const response = await apiClient.post<Collaboration>(
      `/api/collaborations/${collaborationId}/complete`
    );
    return response.data;
  }

  /**
   * Cancel a collaboration
   */
  async cancelCollaboration(collaborationId: string): Promise<Collaboration> {
    const response = await apiClient.post<Collaboration>(
      `/api/collaborations/${collaborationId}/cancel`
    );
    return response.data;
  }
}

export const collaborationRepository = new CollaborationRepository();
