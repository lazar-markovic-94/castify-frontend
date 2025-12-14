import { UserRole, VerificationStatus, OrgType, TalentTier } from './enums';
import { Location, SocialLink } from './entities';

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
  location: Location;
  profileImageUrl?: string;
}

export interface UpdateLocationRequest {
  location: Location;
}

export interface UpdateLanguagesRequest {
  languages: string[];
}

export interface UpdateTagsRequest {
  tags: string[];
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

export interface UpdateSocialLinksRequest {
  socialLinks: SocialLink[];
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
