import { apiClient } from '../apiClient';
import { TalentRating, TalentStatistics } from '../../domain/entities';
import {
  CreateRatingRequest,
  GetRatingsRequest,
  RatingsPageResponse,
  LeaderboardResponse,
} from '../../domain/dtos';

class RatingRepository {
  /**
   * Create a new rating for a talent (CLIENT only)
   */
  async createRating(request: CreateRatingRequest): Promise<TalentRating> {
    const response = await apiClient.post<TalentRating>('/api/ratings', request);
    return response.data;
  }

  /**
   * Get a specific rating by ID
   */
  async getRatingById(ratingId: string): Promise<TalentRating> {
    const response = await apiClient.get<TalentRating>(`/api/ratings/${ratingId}`);
    return response.data;
  }

  /**
   * Get paginated ratings for a talent
   */
  async getTalentRatings(request: GetRatingsRequest): Promise<RatingsPageResponse> {
    const { talentProfileId, page = 0, size = 10 } = request;
    const response = await apiClient.get<RatingsPageResponse>(
      `/api/ratings/talent/${talentProfileId}`,
      {
        params: { page, size },
      }
    );
    return response.data;
  }

  /**
   * Get statistics for a talent
   */
  async getTalentStatistics(talentProfileId: string): Promise<TalentStatistics> {
    const response = await apiClient.get<TalentStatistics>(
      `/api/statistics/${talentProfileId}`
    );
    return response.data;
  }

  /**
   * Get leaderboard data
   */
  async getLeaderboard(): Promise<LeaderboardResponse> {
    const response = await apiClient.get<LeaderboardResponse>('/api/leaderboard');
    return response.data;
  }
}

export const ratingRepository = new RatingRepository();
