import { z } from 'zod';
import {
  UserRole,
  LocationMode,
  VerificationStatus,
  OrgType,
  MediaType,
  ContentType,
  TalentTier,
  CollaborationStatus,
} from './enums';

/**
 * Zod schemas for runtime validation of API responses
 * Ensures type safety and catches API contract violations
 */

// Auth Schemas
export const UserSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
  phone: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const AuthCredentialsSchema = z.object({
  token: z.string().min(1, 'Token cannot be empty'),
  userId: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
});

// Location Schemas
export const PrimaryLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  city: z.string(),
  country: z.string(),
});

export const GeoAreaSchema = z.object({
  city: z.string(),
  country: z.string(),
  isPrimary: z.boolean(),
});

// Talent Schemas
export const TalentCapabilitiesSchema = z.object({
  canDoVoiceover: z.boolean(),
  canDoActing: z.boolean(),
  canDoModeling: z.boolean(),
  canDoSinging: z.boolean(),
  canDoDancing: z.boolean(),
  canDoHosting: z.boolean(),
  otherCapabilities: z.string().nullable(),
});

export const TalentProfileSchema = z.object({
  talentProfileId: z.string(),
  userId: z.string(),
  fullName: z.string(),
  bio: z.string().nullable(),
  locationMode: z.nativeEnum(LocationMode),
  primaryLocation: PrimaryLocationSchema.nullable(),
  geoAreas: z.array(GeoAreaSchema),
  languages: z.array(z.string()),
  tags: z.array(z.string()),
  primaryTags: z.array(z.string()),
  secondaryTags: z.array(z.string()),
  capabilities: TalentCapabilitiesSchema,
  verificationStatus: z.nativeEnum(VerificationStatus),
  profileImageUrl: z.string().nullable(),
  introductionVideoUrl: z.string().nullable(),
  introductionVideoDuration: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  tier: z.nativeEnum(TalentTier).nullable(),
  averageRating: z.number().nullable(),
  totalRatings: z.number().nullable(),
  completedCollaborations: z.number().nullable(),
  successRate: z.number().nullable(),
});

// Client Organization Schema
export const ClientOrgSchema = z.object({
  clientOrgId: z.string(),
  userId: z.string(),
  orgName: z.string(),
  orgType: z.nativeEnum(OrgType),
  description: z.string().nullable(),
  website: z.string().nullable(),
  contactEmail: z.string().email().nullable(),
  contactPhone: z.string().nullable(),
  address: z.string().nullable(),
  logoUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Media Schemas
export const MediaAssetSchema = z.object({
  mediaAssetId: z.string(),
  uploadedByUserId: z.string(),
  mediaType: z.nativeEnum(MediaType),
  contentType: z.nativeEnum(ContentType),
  fileUrl: z.string().url(),
  thumbnailUrl: z.string().url().nullable(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  durationSeconds: z.number().nullable(),
  fileSizeBytes: z.number(),
  uploadedAt: z.string(),
});

export const PortfolioItemWithMediaSchema = z.object({
  portfolioItemId: z.string(),
  talentProfileId: z.string(),
  mediaAsset: MediaAssetSchema,
  displayOrder: z.number(),
  addedAt: z.string(),
});

// Messaging Schemas
export const ConversationSchema = z.object({
  conversationId: z.string(),
  talentUserId: z.string(),
  clientUserId: z.string(),
  createdAt: z.string(),
  lastMessageAt: z.string(),
});

export const MessageSchema = z.object({
  messageId: z.string(),
  conversationId: z.string(),
  senderUserId: z.string(),
  content: z.string(),
  sentAt: z.string(),
  isRead: z.boolean(),
  readAt: z.string().nullable(),
});

// Rating Schema
export const TalentRatingSchema = z.object({
  ratingId: z.string(),
  talentProfileId: z.string(),
  clientUserId: z.string(),
  collaborationId: z.string().nullable(),
  overallRating: z.number().min(1).max(5),
  professionalismRating: z.number().min(1).max(5),
  qualityRating: z.number().min(1).max(5),
  communicationRating: z.number().min(1).max(5),
  timelinessRating: z.number().min(1).max(5),
  averageRating: z.number().min(1).max(5),
  reviewText: z.string().nullable(),
  wouldWorkAgain: z.boolean(),
  createdAt: z.string(),
  isVerified: z.boolean(),
});

// Collaboration Schema
export const CollaborationSchema = z.object({
  collaborationId: z.string(),
  clientUserId: z.string(),
  talentProfileId: z.string(),
  title: z.string(),
  description: z.string(),
  budget: z.number().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  status: z.nativeEnum(CollaborationStatus),
  proposedAt: z.string(),
  respondedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Paginated Response Schema
export function createPagedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    content: z.array(itemSchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    isFirst: z.boolean(),
    isLast: z.boolean(),
  });
}

// Specific paged response schemas
export const PagedTalentProfileSchema = createPagedResponseSchema(TalentProfileSchema);
export const PagedCollaborationSchema = createPagedResponseSchema(CollaborationSchema);
export const PagedTalentRatingSchema = createPagedResponseSchema(TalentRatingSchema);

/**
 * Utility function to validate API response
 * Throws a descriptive error if validation fails
 */
export function validateApiResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error('API Response Validation Failed:', result.error.format());
    throw new Error(`Invalid API response: ${result.error.message}`);
  }

  return result.data;
}
