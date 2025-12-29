import { z } from 'zod';

/**
 * Common validation patterns and utilities
 * Centralized validation logic for reuse across the application
 */

// Constants
export const VALIDATION_LIMITS = {
  // Text fields
  NAME_MIN: 2,
  NAME_MAX: 100,
  BIO_MIN: 50,
  BIO_MAX: 1000,
  DESCRIPTION_MAX: 1000,
  REVIEW_MIN: 10,
  REVIEW_MAX: 2000,
  MESSAGE_MAX: 2000,
  TITLE_MAX: 200,

  // Passwords
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,

  // Location
  LATITUDE_MIN: -90,
  LATITUDE_MAX: 90,
  LONGITUDE_MIN: -180,
  LONGITUDE_MAX: 180,
  LOCATION_NAME_MIN: 2,
  LOCATION_NAME_MAX: 100,

  // Budget
  BUDGET_MIN: 0,
  BUDGET_MAX: 10000000,

  // File sizes (in MB)
  IMAGE_MAX_MB: 5,
  VIDEO_MAX_MB: 100,
  AUDIO_MAX_MB: 50,
  GENERAL_MEDIA_MAX_MB: 100,

  // Video
  INTRO_VIDEO_MAX_SECONDS: 30,
} as const;

// Regular expressions
export const REGEX_PATTERNS = {
  PHONE: /^\+?[\d\s\-()]{7,20}$/,
  LANGUAGE: /^[a-zA-Z\s\u00C0-\u024F\u1E00-\u1EFF]+$/, // Letters, spaces, and accented characters
  URL_SAFE: /^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/,
} as const;

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .toLowerCase();

/**
 * Optional email schema (allows empty string)
 */
export const optionalEmailSchema = z
  .string()
  .trim()
  .email('Invalid email address')
  .optional()
  .or(z.literal(''));

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(
    VALIDATION_LIMITS.PASSWORD_MIN,
    `Password must be at least ${VALIDATION_LIMITS.PASSWORD_MIN} characters`
  )
  .max(VALIDATION_LIMITS.PASSWORD_MAX, 'Password is too long');

/**
 * URL validation schema
 */
export const urlSchema = z
  .string()
  .trim()
  .url('Invalid URL format')
  .refine((url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'URL must use http or https protocol');

/**
 * Optional URL schema (allows empty string)
 */
export const optionalUrlSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (!val || val === '') return true;
      try {
        const parsed = new URL(val);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    },
    { message: 'Invalid URL format' }
  )
  .optional()
  .or(z.literal(''));

/**
 * Phone number validation schema
 */
export const phoneSchema = z
  .string()
  .trim()
  .regex(REGEX_PATTERNS.PHONE, 'Invalid phone number format');

/**
 * Optional phone number schema
 */
export const optionalPhoneSchema = z
  .string()
  .trim()
  .regex(REGEX_PATTERNS.PHONE, 'Invalid phone number format')
  .optional()
  .or(z.literal(''));

/**
 * Latitude validation schema
 */
export const latitudeSchema = z
  .number()
  .min(VALIDATION_LIMITS.LATITUDE_MIN, 'Latitude must be between -90 and 90')
  .max(VALIDATION_LIMITS.LATITUDE_MAX, 'Latitude must be between -90 and 90');

/**
 * Longitude validation schema
 */
export const longitudeSchema = z
  .number()
  .min(VALIDATION_LIMITS.LONGITUDE_MIN, 'Longitude must be between -180 and 180')
  .max(VALIDATION_LIMITS.LONGITUDE_MAX, 'Longitude must be between -180 and 180');

/**
 * Location schema (city, country, coordinates)
 */
export const locationSchema = z.object({
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
  latitude: latitudeSchema,
  longitude: longitudeSchema,
});

/**
 * Budget validation schema
 */
export const budgetSchema = z
  .number()
  .min(VALIDATION_LIMITS.BUDGET_MIN, 'Budget must be positive')
  .max(VALIDATION_LIMITS.BUDGET_MAX, 'Budget amount is too large')
  .multipleOf(0.01, 'Budget can have maximum 2 decimal places')
  .optional()
  .nullable();

/**
 * Future date validation
 */
export const futureDateSchema = z.string().refine(
  (dateStr) => {
    if (!dateStr) return true;
    const date = new Date(dateStr);
    return date > new Date();
  },
  { message: 'Date must be in the future' }
);

/**
 * Validate that end date is after start date
 */
export const dateRangeValidator = (
  startDate: string | null | undefined,
  endDate: string | null | undefined
): boolean => {
  if (!startDate || !endDate) return true;
  return new Date(endDate) >= new Date(startDate);
};

/**
 * Language validation (single language)
 */
export const languageValidator = (language: string): boolean => {
  const trimmed = language.trim();
  return trimmed.length >= 2 && REGEX_PATTERNS.LANGUAGE.test(trimmed);
};

/**
 * Parse and validate comma-separated languages
 */
export const parseLanguages = (languagesString: string): string[] => {
  return languagesString
    .split(',')
    .map((l) => l.trim())
    .filter((l) => languageValidator(l));
};

/**
 * File size validation (in bytes)
 */
export const validateFileSize = (fileSizeBytes: number, maxSizeMB: number): boolean => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return fileSizeBytes <= maxBytes;
};

/**
 * Image file type validation
 */
export const isValidImageType = (mimeType: string): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(mimeType.toLowerCase());
};

/**
 * Video file type validation
 */
export const isValidVideoType = (mimeType: string): boolean => {
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  return validTypes.includes(mimeType.toLowerCase());
};

/**
 * Audio file type validation
 */
export const isValidAudioType = (mimeType: string): boolean => {
  const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'];
  return validTypes.includes(mimeType.toLowerCase());
};

/**
 * Sanitize user input to prevent XSS
 * Basic sanitization - for display purposes
 */
export const sanitizeText = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Check for duplicate location in array
 */
export const isDuplicateLocation = (
  city: string,
  country: string,
  existingLocations: Array<{ city: string; country: string }>
): boolean => {
  return existingLocations.some(
    (loc) =>
      loc.city.toLowerCase().trim() === city.toLowerCase().trim() &&
      loc.country.toLowerCase().trim() === country.toLowerCase().trim()
  );
};

/**
 * Validate video duration
 */
export const validateVideoDuration = (
  durationSeconds: number,
  maxSeconds: number = VALIDATION_LIMITS.INTRO_VIDEO_MAX_SECONDS
): boolean => {
  return durationSeconds > 0 && durationSeconds <= maxSeconds;
};
