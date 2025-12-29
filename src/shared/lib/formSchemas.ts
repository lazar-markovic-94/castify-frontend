import { z } from 'zod';
import {
  emailSchema,
  passwordSchema,
  optionalEmailSchema,
  optionalUrlSchema,
  optionalPhoneSchema,
  locationSchema,
  budgetSchema,
  dateRangeValidator,
  VALIDATION_LIMITS,
} from './validationUtils';
import { UserRole, OrgType, ServiceType, LocationMode } from '../../core/domain/enums';

/**
 * Centralized form validation schemas using Zod
 * These schemas ensure consistent validation across the application
 */

// ===========================
// AUTHENTICATION SCHEMAS
// ===========================

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  role: z.nativeEnum(UserRole, { required_error: 'Role is required' }),
  phone: optionalPhoneSchema,
});

// ===========================
// TALENT PROFILE SCHEMAS
// ===========================

export const createTalentProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(
      VALIDATION_LIMITS.NAME_MIN,
      `Name must be at least ${VALIDATION_LIMITS.NAME_MIN} characters`
    )
    .max(
      VALIDATION_LIMITS.NAME_MAX,
      `Name must be less than ${VALIDATION_LIMITS.NAME_MAX} characters`
    ),
  bio: z
    .string()
    .trim()
    .min(
      VALIDATION_LIMITS.BIO_MIN,
      `Bio should be at least ${VALIDATION_LIMITS.BIO_MIN} characters`
    )
    .max(
      VALIDATION_LIMITS.BIO_MAX,
      `Bio must be less than ${VALIDATION_LIMITS.BIO_MAX} characters`
    ),
  locationMode: z.nativeEnum(LocationMode),
  primaryLocation: locationSchema,
  geoAreas: z
    .array(
      z.object({
        city: z.string().trim().min(1, 'City is required'),
        country: z.string().trim().min(1, 'Country is required'),
        isPrimary: z.boolean(),
      })
    )
    .optional(),
  profileImageUrl: optionalUrlSchema,
});

export const updatePrimaryLocationSchema = z.object({
  primaryLocation: locationSchema,
});

export const addGeoAreaSchema = z.object({
  city: z
    .string()
    .trim()
    .min(VALIDATION_LIMITS.LOCATION_NAME_MIN, 'City name is required')
    .max(VALIDATION_LIMITS.LOCATION_NAME_MAX, 'City name is too long'),
  country: z
    .string()
    .trim()
    .min(VALIDATION_LIMITS.LOCATION_NAME_MIN, 'Country name is required')
    .max(VALIDATION_LIMITS.LOCATION_NAME_MAX, 'Country name is too long'),
  isPrimary: z.boolean(),
});

export const updateLanguagesSchema = z.object({
  languages: z
    .array(z.string().trim().min(2, 'Language name too short'))
    .min(1, 'At least one language is required'),
});

export const updateTagsSchema = z.object({
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
});

export const updateCapabilitiesSchema = z.object({
  canDoActing: z.boolean().optional(),
  canDoVoiceover: z.boolean().optional(),
  canDoModeling: z.boolean().optional(),
  canDoSinging: z.boolean().optional(),
  canDoDancing: z.boolean().optional(),
  canDoHosting: z.boolean().optional(),
});

export const updateIntroductionVideoSchema = z.object({
  introductionVideoUrl: z.string().url('Invalid video URL'),
  introductionVideoDuration: z
    .number()
    .min(1, 'Video must be at least 1 second')
    .max(
      VALIDATION_LIMITS.INTRO_VIDEO_MAX_SECONDS,
      `Video must be ${VALIDATION_LIMITS.INTRO_VIDEO_MAX_SECONDS} seconds or less`
    ),
});

// ===========================
// CLIENT ORGANIZATION SCHEMAS
// ===========================

export const createClientOrgSchema = z.object({
  orgName: z
    .string()
    .trim()
    .min(VALIDATION_LIMITS.NAME_MIN, 'Organization name is required')
    .max(VALIDATION_LIMITS.NAME_MAX, 'Organization name is too long'),
  orgType: z.nativeEnum(OrgType, { required_error: 'Organization type is required' }),
  description: z
    .string()
    .trim()
    .max(
      VALIDATION_LIMITS.DESCRIPTION_MAX,
      `Description must be less than ${VALIDATION_LIMITS.DESCRIPTION_MAX} characters`
    )
    .optional()
    .or(z.literal('')),
  website: optionalUrlSchema,
  address: z.string().trim().max(200, 'Address is too long').optional().or(z.literal('')),
  contactEmail: optionalEmailSchema,
  contactPhone: optionalPhoneSchema,
  logoUrl: optionalUrlSchema,
});

export const updateClientOrgSchema = createClientOrgSchema;

// ===========================
// COLLABORATION SCHEMAS
// ===========================

export const createCollaborationSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Project title is required')
      .max(
        VALIDATION_LIMITS.TITLE_MAX,
        `Title must be less than ${VALIDATION_LIMITS.TITLE_MAX} characters`
      ),
    description: z
      .string()
      .trim()
      .min(10, 'Description should be at least 10 characters')
      .max(
        VALIDATION_LIMITS.DESCRIPTION_MAX,
        `Description must be less than ${VALIDATION_LIMITS.DESCRIPTION_MAX} characters`
      ),
    servicesRequired: z
      .array(z.nativeEnum(ServiceType))
      .min(1, 'At least one service must be selected'),
    deadline: z.string().min(1, 'Deadline is required'),
    budget: z
      .union([z.string(), z.number()])
      .transform((val) => (typeof val === 'string' ? (val === '' ? null : parseFloat(val)) : val))
      .pipe(budgetSchema),
    startDate: z.string().optional().or(z.literal('')),
    endDate: z.string().optional().or(z.literal('')),
    notes: z
      .string()
      .trim()
      .max(VALIDATION_LIMITS.DESCRIPTION_MAX, 'Notes are too long')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      // Validate deadline is in the future
      if (data.deadline) {
        const deadlineDate = new Date(data.deadline);
        return deadlineDate > new Date();
      }
      return true;
    },
    { message: 'Deadline must be in the future', path: ['deadline'] }
  )
  .refine(
    (data) => {
      // Validate end date is after start date
      return dateRangeValidator(data.startDate, data.endDate);
    },
    { message: 'End date must be after start date', path: ['endDate'] }
  )
  .refine(
    (data) => {
      // Validate start date is not before deadline
      if (data.deadline && data.startDate) {
        return new Date(data.startDate) <= new Date(data.deadline);
      }
      return true;
    },
    { message: 'Start date should not be after deadline', path: ['startDate'] }
  );

// ===========================
// REVIEW/RATING SCHEMAS
// ===========================

export const createRatingSchema = z.object({
  overallRating: z.number().min(1, 'Overall rating is required').max(5),
  professionalismRating: z.number().min(1, 'Professionalism rating is required').max(5),
  qualityRating: z.number().min(1, 'Quality rating is required').max(5),
  communicationRating: z.number().min(1, 'Communication rating is required').max(5),
  timelinessRating: z.number().min(1, 'Timeliness rating is required').max(5),
  reviewText: z
    .string()
    .trim()
    .refine(
      (text) => {
        if (!text || text.length === 0) return true; // Optional field
        return text.length >= VALIDATION_LIMITS.REVIEW_MIN;
      },
      { message: `Review must be at least ${VALIDATION_LIMITS.REVIEW_MIN} characters if provided` }
    )
    .refine((text) => text.length <= VALIDATION_LIMITS.REVIEW_MAX, {
      message: `Review must be less than ${VALIDATION_LIMITS.REVIEW_MAX} characters`,
    })
    .optional()
    .nullable(),
  wouldWorkAgain: z.boolean(),
});

// ===========================
// MEDIA UPLOAD SCHEMAS
// ===========================

export const mediaUploadMetadataSchema = z.object({
  title: z
    .string()
    .trim()
    .max(
      VALIDATION_LIMITS.TITLE_MAX,
      `Title must be less than ${VALIDATION_LIMITS.TITLE_MAX} characters`
    )
    .optional(),
  description: z
    .string()
    .trim()
    .max(
      VALIDATION_LIMITS.DESCRIPTION_MAX,
      `Description must be less than ${VALIDATION_LIMITS.DESCRIPTION_MAX} characters`
    )
    .optional(),
});

// ===========================
// MESSAGING SCHEMAS
// ===========================

export const sendMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(
      VALIDATION_LIMITS.MESSAGE_MAX,
      `Message must be less than ${VALIDATION_LIMITS.MESSAGE_MAX} characters`
    ),
});

// ===========================
// TYPE EXPORTS
// ===========================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateTalentProfileFormData = z.infer<typeof createTalentProfileSchema>;
export type UpdatePrimaryLocationFormData = z.infer<typeof updatePrimaryLocationSchema>;
export type AddGeoAreaFormData = z.infer<typeof addGeoAreaSchema>;
export type UpdateLanguagesFormData = z.infer<typeof updateLanguagesSchema>;
export type UpdateTagsFormData = z.infer<typeof updateTagsSchema>;
export type UpdateCapabilitiesFormData = z.infer<typeof updateCapabilitiesSchema>;
export type CreateClientOrgFormData = z.infer<typeof createClientOrgSchema>;
export type UpdateClientOrgFormData = z.infer<typeof updateClientOrgSchema>;
export type CreateCollaborationFormData = z.infer<typeof createCollaborationSchema>;
export type CreateRatingFormData = z.infer<typeof createRatingSchema>;
export type MediaUploadMetadataFormData = z.infer<typeof mediaUploadMetadataSchema>;
export type SendMessageFormData = z.infer<typeof sendMessageSchema>;
