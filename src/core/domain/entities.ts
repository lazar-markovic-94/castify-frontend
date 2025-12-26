import {
  UserRole,
  LocationMode,
  VerificationStatus,
  OrgType,
  MediaType,
  ContentType,
  TalentTier,
  CollaborationStatus,
  ServiceType,
} from './enums';

// Auth Entities
export interface User {
  userId: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  isActive?: boolean;
}

export interface AuthCredentials {
  token: string;
  userId: string;
  email: string;
  role: UserRole;
}

// Primary Location (with coordinates for distance search)
export interface PrimaryLocation {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

// Geographical Service Area
export interface GeoArea {
  city: string;
  country: string;
  isPrimary: boolean;
}

// Talent Capabilities
export interface TalentCapabilities {
  canDoVoiceover: boolean;
  canDoActing: boolean;
  canDoModeling: boolean;
  canDoSinging: boolean;
  canDoDancing: boolean;
  canDoHosting: boolean;
  otherCapabilities: string | null;
}

// Talent Profile
export interface TalentProfile {
  talentProfileId: string;
  userId: string;
  fullName: string;
  bio: string | null;
  locationMode: LocationMode;
  primaryLocation: PrimaryLocation | null;
  geoAreas: GeoArea[];
  languages: string[];
  tags: string[];
  primaryTags: string[];
  secondaryTags: string[];
  capabilities: TalentCapabilities;
  verificationStatus: VerificationStatus;
  profileImageUrl: string | null;
  introductionVideoUrl: string | null;
  introductionVideoDuration: number | null;
  createdAt: string;
  updatedAt: string;
  // Rating and statistics
  tier: TalentTier | null;
  averageRating: number | null;
  totalRatings: number | null;
  completedCollaborations: number | null;
  successRate: number | null;
}

// Client Organization
export interface ClientOrg {
  clientOrgId: string;
  userId: string;
  orgName: string;
  orgType: OrgType;
  description: string | null;
  website: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// Media Asset
export interface MediaAsset {
  mediaAssetId: string;
  uploadedByUserId: string;
  mediaType: MediaType;
  contentType: ContentType;
  fileUrl: string;
  thumbnailUrl: string | null;
  title: string | null;
  description: string | null;
  durationSeconds: number | null;
  fileSizeBytes: number;
  uploadedAt: string;
}

// Portfolio Item
export interface PortfolioItem {
  portfolioItemId: string;
  talentProfileId: string;
  mediaAssetId: string;
  displayOrder: number;
  addedAt: string;
}

// Portfolio Item with Media (for displaying portfolio)
export interface PortfolioItemWithMedia {
  portfolioItemId: string;
  talentProfileId: string;
  mediaAsset: MediaAsset;
  displayOrder: number;
  addedAt: string;
}

// Conversation
export interface Conversation {
  conversationId: string;
  talentUserId: string;
  clientUserId: string;
  createdAt: string;
  lastMessageAt: string;
}

// Message
export interface Message {
  messageId: string;
  conversationId: string;
  senderUserId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  readAt: string | null;
}

// Rating
export interface TalentRating {
  ratingId: string;
  talentProfileId: string;
  clientUserId: string;
  collaborationId: string | null;
  overallRating: number;
  professionalismRating: number;
  qualityRating: number;
  communicationRating: number;
  timelinessRating: number;
  averageRating: number;
  reviewText: string | null;
  wouldWorkAgain: boolean;
  createdAt: string;
  isVerified: boolean;
}

// Statistics
export interface TalentStatistics {
  talentProfileId: string;
  averageRating: number;
  totalRatings: number;
  ratingBreakdown: RatingBreakdown;
  collaborationMetrics: CollaborationMetrics;
  financialMetrics: FinancialMetrics;
  engagementMetrics: EngagementMetrics;
  tier: TalentTier;
  lastUpdated: string;
}

export interface RatingBreakdown {
  averageProfessionalism: number;
  averageQuality: number;
  averageCommunication: number;
  averageTimeliness: number;
}

export interface CollaborationMetrics {
  totalCollaborations: number;
  completedCollaborations: number;
  canceledCollaborations: number;
  successRate: number;
  wouldWorkAgainPercentage: number;
}

export interface FinancialMetrics {
  totalEarnings: number;
}

export interface EngagementMetrics {
  averageResponseTimeHours: number | null;
  profileCompleteness: number;
}

// Leaderboard
export interface LeaderboardEntry {
  talentProfileId: string;
  averageRating: number;
  completedCollaborations: number;
  tier: TalentTier;
}

// Collaboration
export interface Collaboration {
  collaborationId: string;
  clientUserId: string;
  talentProfileId: string;
  title: string;
  description: string;
  servicesRequired: ServiceType[];
  deadline: string | null;
  budget: number | null;
  startDate: string | null;
  endDate: string | null;
  status: CollaborationStatus;
  proposedAt: string;
  respondedAt: string | null;
  completedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
