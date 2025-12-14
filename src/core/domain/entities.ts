import { UserRole, LocationMode, VerificationStatus, OrgType, MediaType, ContentType, TalentTier } from './enums';

// Auth Entities
export interface User {
  userId: string;
  email: string;
  role: UserRole;
  phone: string | null;
  isActive: boolean;
}

export interface AuthCredentials {
  token: string;
  userId: string;
  email: string;
  role: UserRole;
}

// Location
export interface Location {
  mode: LocationMode;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
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

// Social Link
export interface SocialLink {
  platform: string;
  url: string;
  followerCount: number | null;
}

// Talent Profile
export interface TalentProfile {
  talentProfileId: string;
  userId: string;
  fullName: string;
  bio: string | null;
  location: Location;
  languages: string[];
  tags: string[];
  capabilities: TalentCapabilities;
  socialLinks: SocialLink[];
  verificationStatus: VerificationStatus;
  profileImageUrl: string | null;
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
