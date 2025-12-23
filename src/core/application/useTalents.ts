import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { talentRepository } from '../data/repositories';
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
} from '../domain/dtos';

export const useMyTalentProfile = () => {
  return useQuery({
    queryKey: ['myTalentProfile'],
    queryFn: async () => {
      try {
        return await talentRepository.getMyProfile();
      } catch (error: any) {
        console.error('Error fetching my talent profile:', error);
        console.error('Error response:', error.response?.data);
        throw error;
      }
    },
  });
};

export const useTalentProfile = (talentProfileId: string | undefined) => {
  return useQuery({
    queryKey: ['talentProfile', talentProfileId],
    queryFn: () => talentRepository.getProfileById(talentProfileId!),
    enabled: !!talentProfileId,
  });
};

export const useTalentProfileByUserId = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['talentProfileByUserId', userId],
    queryFn: () => talentRepository.getProfileByUserId(userId!),
    enabled: !!userId,
  });
};

export const useCreateTalentProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTalentProfileRequest) => talentRepository.createProfile(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTalentProfile'] });
    },
  });
};

export const useUpdatePrimaryLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdatePrimaryLocationRequest) => talentRepository.updatePrimaryLocation(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTalentProfile'] });
    },
  });
};

export const useAddGeoArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddGeoAreaRequest) => talentRepository.addGeoArea(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTalentProfile'] });
    },
  });
};

export const useRemoveGeoArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: RemoveGeoAreaRequest) => talentRepository.removeGeoArea(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTalentProfile'] });
    },
  });
};

export const useUpdateGeoAreas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateGeoAreasRequest) => talentRepository.updateGeoAreas(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTalentProfile'] });
    },
  });
};

export const useUpdateTalentLanguages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateLanguagesRequest) => talentRepository.updateLanguages(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTalentProfile'] });
    },
  });
};

export const useUpdateTalentTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTagsRequest) => talentRepository.updateTags(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTalentProfile'] });
    },
  });
};

export const useUpdateTalentCapabilities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateCapabilitiesRequest) =>
      talentRepository.updateCapabilities(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTalentProfile'] });
    },
  });
};

export const useUpdateTalentSocialLinks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateSocialLinksRequest) =>
      talentRepository.updateSocialLinks(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTalentProfile'] });
    },
  });
};

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileImageUrl: string) => talentRepository.updateProfileImage(profileImageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTalentProfile'] });
    },
  });
};

export const useSearchTalents = (request: TalentSearchRequest) => {
  return useQuery({
    queryKey: ['searchTalents', request],
    queryFn: () => talentRepository.searchTalents(request),
  });
};
