import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

// JourneyPath: draws an SVG curved path, step markers, and animates a dot along the path
// props:
// - steps: array of {label} (number of steps determines marker positions)
// - duration: animation duration in ms

const JourneyPath = ({ steps = [], duration = 4500 }) => {
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [markerPositions, setMarkerPositions] = useState([]);

  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl) return;

    const totalLength = pathEl.getTotalLength();

    // compute marker positions evenly along the path
    const positions = steps.map((_, i) => {
      const fraction = i / Math.max(1, steps.length - 1);
      const point = pathEl.getPointAtLength(fraction * totalLength);
      return { x: point.x, y: point.y, fraction };
    });
    setMarkerPositions(positions);
    setReady(true);
  }, [steps]);

  useEffect(() => {
    const pathEl = pathRef.current;
    const dotEl = dotRef.current;
    if (!pathEl || !dotEl || !ready) return;

    const length = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = length;
    pathEl.style.strokeDashoffset = length;

    let start = null;
    let rafId = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const t = Math.min(1, elapsed / duration);

      // animate stroke draw
      pathEl.style.strokeDashoffset = Math.round(length * (1 - t));

      // move dot along path
      const point = pathEl.getPointAtLength(t * length);
      dotEl.setAttribute('cx', point.x);
      dotEl.setAttribute('cy', point.y);

      // update marker highlight by setting data-progress on svg container
      const svgNode = pathEl.ownerSVGElement;
      if (svgNode) svgNode.setAttribute('data-progress', t.toString());

      if (t < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [ready, duration]);

  return (
    <Box sx={{ width: '100%', py: 2 }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Journey — From Sign Up to Creator</Typography>

      <Box sx={{ width: '100%', overflow: 'visible' }}>
        <svg viewBox="0 0 900 160" width="100%" height="160" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="jp-grad" x1="0" x2="1">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* decorative background track */}
          <path
            d="M40 120 C 200 10, 400 10, 560 120 C 680 200, 820 40, 860 120"
            fill="none"
            stroke="#eef2ff"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* animated path */}
          <path
            ref={pathRef}
            d="M40 120 C 200 10, 400 10, 560 120 C 680 200, 820 40, 860 120"
            fill="none"
            stroke="url(#jp-grad)"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.2s linear' }}
          />

          {/* markers */}
          {markerPositions.map((m, i) => (
            <g key={i}>
              <circle
                cx={m.x}
                cy={m.y}
                r={16}
                fill="#fff"
                stroke="#dbeafe"
                strokeWidth={2}
                style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
              />
              <circle
                cx={m.x}
                cy={m.y}
                r={10}
                fill="#667eea"
                style={{ transition: 'transform 0.2s' }}
              />
              <text x={m.x} y={m.y + 36} fontSize="12" textAnchor="middle" fill="#0f172a">
                {steps[i]?.label}
              </text>
            </g>
          ))}

          {/* moving dot */}
          <circle ref={dotRef} cx={40} cy={120} r={8} fill="#ffb020" stroke="#fff" strokeWidth={2} />
        </svg>
      </Box>
    </Box>
  );
};

export default JourneyPath;
