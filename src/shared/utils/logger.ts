/* eslint-disable @typescript-eslint/no-explicit-any */
import { isDev, isDebugEnabled } from '../../config/env';

/**
 * Production-safe logger utility
 * Prevents sensitive data from being logged in production
 */

const SENSITIVE_PATTERNS = [
  /bearer\s+[\w-]+\.[\w-]+\.[\w-]+/gi, // JWT tokens
  /password/gi,
  /token/gi,
  /authorization/gi,
  /api[_-]?key/gi,
];

/**
 * Sanitizes potentially sensitive data from log messages
 */
function sanitize(data: any): any {
  if (typeof data === 'string') {
    let sanitized = data;
    SENSITIVE_PATTERNS.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });
    return sanitized;
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized: any = Array.isArray(data) ? [] : {};
    for (const key in data) {
      // Redact sensitive keys entirely
      if (
        key.toLowerCase().includes('password') ||
        key.toLowerCase().includes('token') ||
        key.toLowerCase().includes('authorization') ||
        key.toLowerCase().includes('secret')
      ) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitize(data[key]);
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * Logger instance
 * Only logs in development or when debug is enabled
 */
export const logger = {
  /**
   * Debug logging - only in development
   */
  log: (...args: any[]) => {
    if (isDev || isDebugEnabled) {
      console.log(...args);
    }
  },

  /**
   * Error logging - always logs but sanitizes sensitive data
   */
  error: (...args: any[]) => {
    const sanitizedArgs = args.map((arg) => sanitize(arg));
    console.error(...sanitizedArgs);
  },

  /**
   * Warning logging - only in development
   */
  warn: (...args: any[]) => {
    if (isDev || isDebugEnabled) {
      console.warn(...args);
    }
  },

  /**
   * Info logging - only in development
   */
  info: (...args: any[]) => {
    if (isDev || isDebugEnabled) {
      console.info(...args);
    }
  },

  /**
   * API request/response logging - only in development, never logs tokens
   */
  api: (method: string, url: string, data?: any) => {
    if (isDev || isDebugEnabled) {
      const sanitizedData = data ? sanitize(data) : undefined;
      console.log(`[API ${method.toUpperCase()}] ${url}`, sanitizedData);
    }
  },
};

/**
 * Never log these in any environment
 * This is a compile-time helper to prevent accidental logging
 */
export const NEVER_LOG = {
  token: () => {
    throw new Error('🚨 SECURITY: Never log authentication tokens!');
  },
  password: () => {
    throw new Error('🚨 SECURITY: Never log passwords!');
  },
  credentials: () => {
    throw new Error('🚨 SECURITY: Never log credentials!');
  },
};
