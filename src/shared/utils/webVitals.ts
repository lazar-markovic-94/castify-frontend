import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';
import { logger } from './logger';

/**
 * Web Vitals monitoring
 * Tracks Core Web Vitals and other performance metrics
 *
 * Core Web Vitals:
 * - LCP (Largest Contentful Paint): Good < 2.5s
 * - FID (First Input Delay): Good < 100ms (deprecated, use INP)
 * - INP (Interaction to Next Paint): Good < 200ms
 * - CLS (Cumulative Layout Shift): Good < 0.1
 *
 * Other metrics:
 * - FCP (First Contentful Paint): Good < 1.8s
 * - TTFB (Time to First Byte): Good < 800ms
 */

interface WebVitalsConfig {
  /**
   * Send metrics to analytics service
   * Replace with your analytics service (Google Analytics, Datadog, etc.)
   */
  sendToAnalytics?: (metric: Metric) => void;

  /**
   * Log to console in development
   */
  logToConsole?: boolean;
}

/**
 * Format metric for logging
 */
function formatMetric(metric: Metric): string {
  const { name, value, rating } = metric;
  const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
  return `${emoji} ${name}: ${value.toFixed(2)}${name === 'CLS' ? '' : 'ms'} (${rating})`;
}

/**
 * Send metric to analytics service
 * TODO: Replace with your actual analytics implementation
 */
function sendToAnalytics(metric: Metric) {
  // Example: Google Analytics 4
  // gtag('event', metric.name, {
  //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
  //   metric_id: metric.id,
  //   metric_value: metric.value,
  //   metric_delta: metric.delta,
  //   metric_rating: metric.rating,
  // });

  // Example: Custom API endpoint
  // fetch('/api/analytics/web-vitals', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     name: metric.name,
  //     value: metric.value,
  //     rating: metric.rating,
  //     delta: metric.delta,
  //     id: metric.id,
  //   }),
  // });

  logger.log('📊 Web Vital:', formatMetric(metric));
}

/**
 * Initialize Web Vitals monitoring
 * Call this once in your app's entry point (main.tsx)
 */
export function initWebVitals(config: WebVitalsConfig = {}) {
  const { sendToAnalytics: customSendToAnalytics, logToConsole = true } = config;

  const handleMetric = (metric: Metric) => {
    // Log to console in development
    if (logToConsole) {
      console.log(formatMetric(metric));
    }

    // Send to analytics
    if (customSendToAnalytics) {
      customSendToAnalytics(metric);
    } else {
      sendToAnalytics(metric);
    }
  };

  // Track Core Web Vitals
  onCLS(handleMetric); // Cumulative Layout Shift
  onLCP(handleMetric); // Largest Contentful Paint
  onINP(handleMetric); // Interaction to Next Paint (replaces FID)

  // Track other metrics
  onFCP(handleMetric); // First Contentful Paint
  onTTFB(handleMetric); // Time to First Byte

  // FID is deprecated but still tracked for compatibility
  onFID(handleMetric);
}

/**
 * Get performance metrics summary
 * Useful for debugging performance issues
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  return {
    // Navigation timing
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    request: navigation.responseStart - navigation.requestStart,
    response: navigation.responseEnd - navigation.responseStart,
    domParsing: navigation.domInteractive - navigation.responseEnd,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    domComplete: navigation.domComplete - navigation.domInteractive,
    loadEvent: navigation.loadEventEnd - navigation.loadEventStart,
    totalTime: navigation.loadEventEnd - navigation.fetchStart,

    // Paint timing
    firstPaint: paint.find((p) => p.name === 'first-paint')?.startTime || 0,
    firstContentfulPaint: paint.find((p) => p.name === 'first-contentful-paint')?.startTime || 0,
  };
}
