import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collaborationRepository } from '../data/repositories';
import { CreateCollaborationRequest } from '../domain/dtos';
import { CollaborationStatus } from '../domain/enums';

/**
 * Hook to get a specific collaboration by ID
 */
export const useCollaboration = (collaborationId: string | undefined) => {
  return useQuery({
    queryKey: ['collaboration', collaborationId],
    queryFn: () => collaborationRepository.getCollaborationById(collaborationId!),
    enabled: !!collaborationId,
  });
};

/**
 * Hook to get collaborations for the current client user
 */
export const useClientCollaborations = (status?: CollaborationStatus) => {
  return useQuery({
    queryKey: ['clientCollaborations', status],
    queryFn: () => collaborationRepository.getClientCollaborations(status),
  });
};

/**
 * Hook to get collaborations for the current talent user
 */
export const useTalentCollaborations = (status?: CollaborationStatus) => {
  return useQuery({
    queryKey: ['talentCollaborations', status],
    queryFn: () => collaborationRepository.getTalentCollaborations(status),
  });
};

/**
 * Hook to create a new collaboration proposal (CLIENT only)
 */
export const useCreateCollaboration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCollaborationRequest) =>
      collaborationRepository.createCollaboration(request),
    onSuccess: (data) => {
      // Invalidate related queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['clientCollaborations'] });
      queryClient.invalidateQueries({ queryKey: ['talentStatistics', data.talentProfileId] });
    },
  });
};

/**
 * Hook to accept a collaboration proposal (TALENT only)
 */
export const useAcceptCollaboration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collaborationId: string) =>
      collaborationRepository.acceptCollaboration(collaborationId),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['collaboration', data.collaborationId] });
      queryClient.invalidateQueries({ queryKey: ['talentCollaborations'] });
      queryClient.invalidateQueries({ queryKey: ['talentStatistics', data.talentProfileId] });
    },
  });
};

/**
 * Hook to decline a collaboration proposal (TALENT only)
 */
export const useDeclineCollaboration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collaborationId: string) =>
      collaborationRepository.declineCollaboration(collaborationId),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['collaboration', data.collaborationId] });
      queryClient.invalidateQueries({ queryKey: ['talentCollaborations'] });
    },
  });
};

/**
 * Hook to start work on an accepted collaboration
 */
export const useStartCollaboration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collaborationId: string) =>
      collaborationRepository.startCollaboration(collaborationId),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['collaboration', data.collaborationId] });
      queryClient.invalidateQueries({ queryKey: ['clientCollaborations'] });
      queryClient.invalidateQueries({ queryKey: ['talentCollaborations'] });
    },
  });
};

/**
 * Hook to complete an in-progress collaboration
 */
export const useCompleteCollaboration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collaborationId: string) =>
      collaborationRepository.completeCollaboration(collaborationId),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['collaboration', data.collaborationId] });
      queryClient.invalidateQueries({ queryKey: ['clientCollaborations'] });
      queryClient.invalidateQueries({ queryKey: ['talentCollaborations'] });
      queryClient.invalidateQueries({ queryKey: ['talentStatistics', data.talentProfileId] });
    },
  });
};

/**
 * Hook to cancel a collaboration
 */
export const useCancelCollaboration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collaborationId: string) =>
      collaborationRepository.cancelCollaboration(collaborationId),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['collaboration', data.collaborationId] });
      queryClient.invalidateQueries({ queryKey: ['clientCollaborations'] });
      queryClient.invalidateQueries({ queryKey: ['talentCollaborations'] });
      queryClient.invalidateQueries({ queryKey: ['talentStatistics', data.talentProfileId] });
    },
  });
};
