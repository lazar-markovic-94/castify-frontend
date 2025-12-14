import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientOrgRepository } from '../data/repositories';
import { CreateClientOrgRequest, UpdateClientOrgRequest } from '../domain/dtos';

export const useMyClientOrg = () => {
  return useQuery({
    queryKey: ['myClientOrg'],
    queryFn: () => clientOrgRepository.getMyOrganization(),
  });
};

export const useClientOrg = (clientOrgId: string | undefined) => {
  return useQuery({
    queryKey: ['clientOrg', clientOrgId],
    queryFn: () => clientOrgRepository.getOrganizationById(clientOrgId!),
    enabled: !!clientOrgId,
  });
};

export const useClientOrgByUserId = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['clientOrgByUserId', userId],
    queryFn: () => clientOrgRepository.getOrganizationByUserId(userId!),
    enabled: !!userId,
  });
};

export const useCreateClientOrg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateClientOrgRequest) =>
      clientOrgRepository.createOrganization(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myClientOrg'] });
    },
  });
};

export const useUpdateClientOrg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateClientOrgRequest) =>
      clientOrgRepository.updateOrganization(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myClientOrg'] });
    },
  });
};
