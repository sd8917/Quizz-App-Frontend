import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Button } from '@mui/material';
import { getAllPerformanceMetrics, observeLongTasks, logCoreWebVitals } from '../utils/performanceHook';

/**
 * Performance Dashboard Component
 * Shows real-time performance metrics in development
 */
const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Define observer function before useEffect
  const observerLongTasks = () => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn(`⚠️  [Long Task] Duration: ${entry.duration.toFixed(2)}ms`);
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.log('⚠️  PerformanceObserver: longtask not supported');
      }
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Initial metrics
    const initialMetrics = getAllPerformanceMetrics();
    setMetrics(initialMetrics);

    // Setup observers
    observeLongTasks();
    logCoreWebVitals();

    // Log metrics to console
    console.log('📊 Performance Metrics:', initialMetrics);

    // Expose performance object to window for manual inspection
    window.__PERFORMANCE__ = {
      getMetrics: getAllPerformanceMetrics,
      logMetrics: () => console.table(getAllPerformanceMetrics()),
      observerLongTasks,
    };

    // Keyboard shortcut: Press Ctrl+Shift+P to toggle dashboard
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyP') {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 400,
        maxHeight: '80vh',
        overflowY: 'auto',
        zIndex: 9999,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      }}
    >
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              📊 Performance Dashboard
            </Typography>
            <Button
              size="small"
              onClick={() => setIsVisible(false)}
              sx={{ minWidth: 'auto', p: 0.5 }}
            >
              ✕
            </Button>
          </Box>

          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
            Press Ctrl+Shift+P to toggle
          </Typography>

          {metrics ? (
            <Grid container spacing={2}>
              {/* Navigation Timing */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  🌐 Navigation Timing
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {metrics.dns && (
                    <Chip label={`DNS: ${metrics.dns.toFixed(0)}ms`} size="small" color="primary" />
                  )}
                  {metrics.tcp && (
                    <Chip label={`TCP: ${metrics.tcp.toFixed(0)}ms`} size="small" color="primary" />
                  )}
                  {metrics.ttfb && (
                    <Chip label={`TTFB: ${metrics.ttfb.toFixed(0)}ms`} size="small" color="primary" />
                  )}
                  {metrics.download && (
                    <Chip
                      label={`Download: ${metrics.download.toFixed(0)}ms`}
                      size="small"
                      color="primary"
                    />
                  )}
                </Box>
              </Grid>

              {/* Page Timing */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  ⏱️ Page Timing
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {metrics.domInteractive && (
                    <Chip
                      label={`DOM Interactive: ${metrics.domInteractive.toFixed(0)}ms`}
                      size="small"
                      color="success"
                    />
                  )}
                  {metrics.domContentLoaded && (
                    <Chip
                      label={`DCL: ${metrics.domContentLoaded.toFixed(0)}ms`}
                      size="small"
                      color="success"
                    />
                  )}
                  {metrics.loadComplete && (
                    <Chip
                      label={`Load: ${metrics.loadComplete.toFixed(0)}ms`}
                      size="small"
                      color="success"
                    />
                  )}
                </Box>
              </Grid>

              {/* Paint Timing */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  🎨 Paint Timing
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {metrics.firstPaint && (
                    <Chip
                      label={`FP: ${metrics.firstPaint.toFixed(0)}ms`}
                      size="small"
                      color="warning"
                    />
                  )}
                  {metrics.firstContentfulPaint && (
                    <Chip
                      label={`FCP: ${metrics.firstContentfulPaint.toFixed(0)}ms`}
                      size="small"
                      color="warning"
                    />
                  )}
                </Box>
              </Grid>

              {/* Memory */}
              {metrics.memory && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    💾 Memory
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Used: ${metrics.memory.usedJSHeapSize}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`Total: ${metrics.memory.totalJSHeapSize}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`Limit: ${metrics.memory.jsHeapSizeLimit}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Grid>
              )}

              {/* Actions */}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  onClick={() => {
                    const updated = getAllPerformanceMetrics();
                    setMetrics(updated);
                    console.table(updated);
                  }}
                  sx={{ mt: 1 }}
                >
                  Refresh & Log
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Typography>Loading metrics...</Typography>
          )}

          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 2 }}>
            💡 Open DevTools Console for detailed logs
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PerformanceDashboard;
