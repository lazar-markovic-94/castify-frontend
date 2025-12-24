import { z } from 'zod';

/**
 * Environment variable schema
 * Validates all required environment variables at startup
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z
    .string()
    .url('VITE_API_BASE_URL must be a valid URL')
    .describe('Backend API base URL'),

  VITE_DEBUG: z
    .enum(['true', 'false'])
    .optional()
    .default('false')
    .describe('Enable debug logging'),

  VITE_APP_NAME: z.string().optional().default('Castify').describe('Application name'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables at startup
 * Throws an error if validation fails, preventing the app from starting
 */
function validateEnv(): Env {
  const result = envSchema.safeParse({
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_DEBUG: import.meta.env.VITE_DEBUG,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  });

  if (!result.success) {
    console.error('❌ Environment Configuration Error:');
    console.error('Missing or invalid environment variables:');

    const errors = result.error.format();
    console.error(JSON.stringify(errors, null, 2));

    throw new Error(
      'Invalid environment configuration. Please check your .env file and ensure all required variables are set correctly.'
    );
  }

  // Log successful validation in development
  if (import.meta.env.DEV) {
    console.log('✅ Environment variables validated successfully');
  }

  return result.data;
}

/**
 * Validated environment variables
 * Safe to use throughout the application
 */
export const env = validateEnv();

/**
 * Type-safe environment variable access
 */
export const isDev = import.meta.env.DEV;
export const isProd = import.meta.env.PROD;
export const isDebugEnabled = env.VITE_DEBUG === 'true';
