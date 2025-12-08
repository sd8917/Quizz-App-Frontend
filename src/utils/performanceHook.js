import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to measure and track performance metrics
 * @param {string} componentName - Name of component to track
 * @param {object} deps - Dependencies array
 */
export const usePerformanceMetrics = (componentName, deps = []) => {
  const renderTimeRef = useRef(Date.now());
  const renderCountRef = useRef(0);

  useEffect(() => {
    const renderTime = Date.now() - renderTimeRef.current;
    renderCountRef.current += 1;

    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️  [${componentName}] Render #${renderCountRef.current} - ${renderTime}ms`);

      // Log if render takes longer than 50ms
      if (renderTime > 50) {
        console.warn(
          `⚠️  [${componentName}] Slow render detected: ${renderTime}ms (threshold: 50ms)`
        );
      }
    }

    // Log memory usage if available
    if (performance.memory) {
      const memUsed = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
      const memLimit = (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2);
      if (process.env.NODE_ENV === 'development') {
        console.log(`💾 [${componentName}] Memory: ${memUsed}MB / ${memLimit}MB`);
      }
    }
  }, deps);

  return {
    renderCount: renderCountRef.current,
    logCustomMetric: (metricName, value) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 [${componentName}] ${metricName}: ${value}`);
      }
    },
  };
};

/**
 * Hook to measure API call performance
 */
export const useApiPerformance = (apiName) => {
  const measureApi = useCallback(
    async (apiCall) => {
      const startTime = performance.now();
      const startMark = `${apiName}-start`;
      const endMark = `${apiName}-end`;
      const measureName = `${apiName}-measure`;

      try {
        performance.mark(startMark);
        const result = await apiCall();
        performance.mark(endMark);
        performance.measure(measureName, startMark, endMark);

        const measure = performance.getEntriesByName(measureName)[0];
        const duration = measure.duration;

        if (process.env.NODE_ENV === 'development') {
          console.log(`⏱️  [API] ${apiName} completed in ${duration.toFixed(2)}ms`);
          if (duration > 1000) {
            console.warn(`⚠️  [API] ${apiName} is slow (${duration.toFixed(2)}ms)`);
          }
        }

        // Cleanup
        performance.clearMarks(startMark);
        performance.clearMarks(endMark);
        performance.clearMeasures(measureName);

        return result;
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ [API] ${apiName} failed`, error);
        }
        throw error;
      }
    },
    [apiName]
  );

  return { measureApi };
};

/**
 * Hook to log component lifecycle events
 */
export const useLifecycleLogger = (componentName) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🟢 [${componentName}] Mounted`);
    }
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔴 [${componentName}] Unmounted`);
      }
    };
  }, [componentName]);
};

/**
 * Measure long tasks using PerformanceObserver
 */
export const observeLongTasks = () => {
  if (process.env.NODE_ENV === 'development' && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn(`⚠️  [Long Task] Duration: ${entry.duration.toFixed(2)}ms`);
          if (entry.attribution && entry.attribution[0]) {
            console.warn(`   From: ${entry.attribution[0].name}`);
          }
        }
      });

      // Note: 'longtask' is only available in some browsers
      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.log('⚠️  PerformanceObserver: longtask not supported');
      }

      return observer;
    } catch (e) {
      console.log('⚠️  PerformanceObserver not available');
    }
  }
};

/**
 * Log Core Web Vitals
 */
export const logCoreWebVitals = () => {
  if (process.env.NODE_ENV === 'development') {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log(`📊 [LCP] Largest Contentful Paint: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP not supported
      }
    }

    // First Input Delay
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            console.log(`📊 [FID] First Input Delay: ${entry.processingDuration?.toFixed(2)}ms`);
          });
        });
        observer.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // FID not supported
      }
    }
  }
};

/**
 * Get all performance metrics
 */
export const getAllPerformanceMetrics = () => {
  if (process.env.NODE_ENV === 'development') {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');

    const metrics = {
      // Navigation timing
      dns: navigation?.domainLookupEnd - navigation?.domainLookupStart,
      tcp: navigation?.connectEnd - navigation?.connectStart,
      ttfb: navigation?.responseStart - navigation?.requestStart,
      download: navigation?.responseEnd - navigation?.responseStart,
      domInteractive: navigation?.domInteractive - navigation?.navigationStart,
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.navigationStart,
      loadComplete: navigation?.loadEventEnd - navigation?.navigationStart,

      // Paint timing
      firstPaint: paint.find((p) => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find((p) => p.name === 'first-contentful-paint')?.startTime,

      // Memory (if available)
      memory: performance.memory
        ? {
            usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + 'MB',
            totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + 'MB',
            jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + 'MB',
          }
        : null,
    };

    return metrics;
  }
  return null;
};
