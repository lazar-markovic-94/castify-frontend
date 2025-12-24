import { UserRole, VerificationStatus, OrgType, TalentTier, LocationMode } from './enums';
import { PrimaryLocation, GeoArea } from './entities';

// Auth DTOs
export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Talent DTOs
export interface CreateTalentProfileRequest {
  fullName: string;
  bio?: string;
  locationMode?: LocationMode;
  primaryLocation?: PrimaryLocation;
  geoAreas?: GeoArea[];
  profileImageUrl?: string;
}

export interface UpdatePrimaryLocationRequest {
  primaryLocation: PrimaryLocation;
}

export interface AddGeoAreaRequest {
  city: string;
  country: string;
  isPrimary?: boolean;
}

export interface RemoveGeoAreaRequest {
  city: string;
  country: string;
}

export interface UpdateGeoAreasRequest {
  geoAreas: GeoArea[];
}

export interface UpdateLanguagesRequest {
  languages: string[];
}

export interface UpdateTagsRequest {
  tags: string[];
}

export interface AvailableTagsResponse {
  primaryTags: string[];
  secondaryTags: string[];
}

export interface UpdateCapabilitiesRequest {
  canDoVoiceover: boolean;
  canDoActing: boolean;
  canDoModeling: boolean;
  canDoSinging: boolean;
  canDoDancing: boolean;
  canDoHosting: boolean;
  otherCapabilities?: string;
}

export interface UpdateIntroductionVideoRequest {
  introductionVideoUrl: string;
  introductionVideoDuration: number;
}

export interface TalentSearchRequest {
  tags?: string[];
  languages?: string[];
  canDoVoiceover?: boolean;
  canDoActing?: boolean;
  canDoModeling?: boolean;
  canDoSinging?: boolean;
  canDoDancing?: boolean;
  canDoHosting?: boolean;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  verificationStatus?: VerificationStatus;
  // Rating and tier filters
  minAverageRating?: number;
  tiers?: TalentTier[];
  minCompletedCollaborations?: number;
  page?: number;
  size?: number;
}

export interface PagedResult<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Client Org DTOs
export interface CreateClientOrgRequest {
  orgName: string;
  orgType: OrgType;
  description?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  logoUrl?: string;
}

export interface UpdateClientOrgRequest {
  orgName?: string;
  orgType?: OrgType;
  description?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  logoUrl?: string;
}

// Media DTOs
export interface CreateMediaAssetRequest {
  mediaType: string;
  contentType: string;
  fileUrl: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  durationSeconds?: number;
  fileSizeBytes: number;
}

export interface AddToPortfolioRequest {
  mediaAssetId: string;
  displayOrder?: number;
}

// Messaging DTOs
export interface CreateConversationRequest {
  talentUserId: string;
  clientUserId: string;
}

export interface SendMessageRequest {
  content: string;
}

// Rating DTOs
export interface CreateRatingRequest {
  talentProfileId: string;
  collaborationId?: string | null;
  overallRating: number;
  professionalismRating: number;
  qualityRating: number;
  communicationRating: number;
  timelinessRating: number;
  reviewText?: string | null;
  wouldWorkAgain: boolean;
}

export interface GetRatingsRequest {
  talentProfileId: string;
  page?: number;
  size?: number;
}

export interface RatingsPageResponse {
  ratings: import('./entities').TalentRating[];
  totalRatings: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface LeaderboardResponse {
  topRated: import('./entities').LeaderboardEntry[];
  mostSuccessful: import('./entities').LeaderboardEntry[];
}

// Collaboration DTOs
export interface CreateCollaborationRequest {
  talentProfileId: string;
  title: string;
  description: string;
  budget?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  notes?: string | null;
}

export interface CollaborationsResponse {
  collaborations: import('./entities').Collaboration[];
  total: number;
}
