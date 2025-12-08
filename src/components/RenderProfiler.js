import React, { Profiler } from 'react';

/**
 * Component wrapper for React Profiler
 * Measures render time and phase for components
 */
const RenderProfiler = ({ id, children, logSlowRenders = 50 }) => {
  const onRenderCallback = (
    id, // the "id" of the Profiler where the update occurred
    phase, // either "mount" or "update"
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions // the Set of interactions belonging to this update
  ) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`📊 React Profiler: ${id}`);
      console.log(`Phase: ${phase}`);
      console.log(`Actual duration: ${actualDuration.toFixed(2)}ms`);
      console.log(`Base duration: ${baseDuration.toFixed(2)}ms`);
      console.log(`Start time: ${startTime.toFixed(2)}ms`);
      console.log(`Commit time: ${commitTime.toFixed(2)}ms`);

      // Warn if slow
      if (actualDuration > logSlowRenders) {
        console.warn(`⚠️  Slow ${phase}: ${actualDuration.toFixed(2)}ms (threshold: ${logSlowRenders}ms)`);
      }

      console.groupEnd();
    }
  };

  return (
    <Profiler id={id} onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
};

export default RenderProfiler;
