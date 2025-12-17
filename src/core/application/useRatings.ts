import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ratingRepository } from '../data/repositories';
import { CreateRatingRequest, GetRatingsRequest } from '../domain/dtos';

/**
 * Hook to get a specific rating by ID
 */
export const useRating = (ratingId: string | undefined) => {
  return useQuery({
    queryKey: ['rating', ratingId],
    queryFn: () => ratingRepository.getRatingById(ratingId!),
    enabled: !!ratingId,
  });
};

/**
 * Hook to get paginated ratings for a talent
 */
export const useTalentRatings = (request: GetRatingsRequest) => {
  return useQuery({
    queryKey: ['talentRatings', request],
    queryFn: () => ratingRepository.getTalentRatings(request),
    enabled: !!request.talentProfileId,
  });
};

/**
 * Hook to get statistics for a talent
 */
export const useTalentStatistics = (talentProfileId: string | undefined) => {
  return useQuery({
    queryKey: ['talentStatistics', talentProfileId],
    queryFn: () => ratingRepository.getTalentStatistics(talentProfileId!),
    enabled: !!talentProfileId,
  });
};

/**
 * Hook to get leaderboard data
 */
export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => ratingRepository.getLeaderboard(),
  });
};

/**
 * Hook to create a new rating (CLIENT only)
 */
export const useCreateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateRatingRequest) => ratingRepository.createRating(request),
    onSuccess: (data) => {
      // Invalidate related queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['talentRatings', data.talentProfileId] });
      queryClient.invalidateQueries({ queryKey: ['talentStatistics', data.talentProfileId] });
      queryClient.invalidateQueries({ queryKey: ['talentProfile', data.talentProfileId] });
      queryClient.invalidateQueries({ queryKey: ['searchTalents'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
};
