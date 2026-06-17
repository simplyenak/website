/**
 * Core Web Vitals measurement utility
 * 
 * This file provides functions to measure and report the three Core Web Vitals:
 * - LCP (Largest Contentful Paint)
 * - INP (Interaction to Next Paint) - replaced FID
 * - CLS (Cumulative Layout Shift)
 * 
 * Based on the web-vitals library from Google
 */

import { onCLS, onINP, onLCP } from 'web-vitals';

// Configuration for reporting
const REPORT_INTERVAL = 5000; // Report every 5 seconds
const REPORT_TO_CONSOLE = true; // Set to false in production
const REPORT_TO_ENDPOINT = false; // Set to true if you have an analytics endpoint
const ANALYTICS_ENDPOINT = '/api/analytics'; // Update with your endpoint

// Store for measurements
let clsValue = 0;
let inpValue = 0;
let lcpValue = 0;

/**
 * Send metrics to analytics endpoint
 */
function sendToAnalytics(metric: { name: string; value: number; delta: number }) {
  if (!REPORT_TO_ENDPOINT || !navigator.sendBeacon) return;

  const body = JSON.stringify({
    ...metric,
    timestamp: Date.now(),
    page: window.location.pathname,
  });

  navigator.sendBeacon(ANALYTICS_ENDPOINT, body);
}

/**
 * Report metrics to console or analytics
 */
function reportMetric(metric: { name: string; value: number; delta: number }) {
  if (REPORT_TO_CONSOLE) {
    console.info(`[Web Vitals] ${metric.name}: ${Math.round(metric.value)}`, metric);
  }

  if (REPORT_TO_ENDPOINT) {
    sendToAnalytics(metric);
  }
}

/**
 * Initialize web vitals measurement
 * 
 * Call this once in your application entry point (e.g., in a layout component)
 */
export function initWebVitals() {
  // Measure CLS
  onCLS((metric) => {
    clsValue = metric.value;
    reportMetric(metric);
  });

  // Measure INP (replaces FID)
  onINP((metric) => {
    inpValue = metric.value;
    reportMetric(metric);
  });

  // Measure LCP
  onLCP((metric) => {
    lcpValue = metric.value;
    reportMetric(metric);
  });

  // Periodic reporting (optional)
  if (REPORT_INTERVAL > 0) {
    setInterval(() => {
      if (clsValue > 0) reportMetric({ name: 'CLS', value: clsValue, delta: 0 });
      if (inpValue > 0) reportMetric({ name: 'INP', value: inpValue, delta: 0 });
      if (lcpValue > 0) reportMetric({ name: 'LCP', value: lcpValue, delta: 0 });
    }, REPORT_INTERVAL);
  }
}

/**
 * Get current web vitals values
 * 
 * @returns Object containing current CLS, INP, and LCP values
 */
export function getWebVitals() {
  return {
    cls: clsValue,
    inp: inpValue,
    lcp: lcpValue,
  };
}

/**
 * Check if Core Web Vitals are within good thresholds
 * 
 * @returns Object with boolean values for each metric
 */
export function checkWebVitalsThresholds() {
  return {
    clsGood: clsValue <= 0.1, // Good: ≤ 0.1
    inpGood: inpValue <= 200, // Good: ≤ 200ms (INP threshold)
    lcpGood: lcpValue <= 2500, // Good: ≤ 2500ms
  };
}