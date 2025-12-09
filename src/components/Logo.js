import React from 'react';
import { Box } from '@mui/material';

/**
 * Logo Component - SEO Friendly
 * Displays the TriviaVerse logo with proper semantic HTML
 */
const Logo = ({ 
  size = 'medium', 
  href = '/', 
  alt = 'TriviaVerse - Interactive Quizzes',
  showText = false 
}) => {
  // Size mappings
  const sizeMap = {
    small: { width: 40, height: 40, fontSize: 14 },
    medium: { width: 60, height: 60, fontSize: 16 },
    large: { width: 100, height: 100, fontSize: 20 },
    xl: { width: 150, height: 150, fontSize: 24 }
  };

  const dimensions = sizeMap[size] || sizeMap.medium;

  return (
    <Box
      component="a"
      href={href}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        textDecoration: 'none',
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'scale(1.05)'
        }
      }}
      aria-label={alt}
    >
      {/* TriviaVerse Logo - Optimized for SEO */}
      <img
        src="/logo.png"
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          objectFit: 'contain'
        }}
        loading="eager"
        decoding="async"
      />

      {/* Optional text label */}
      {showText && (
        <Box
          sx={{
            fontSize: dimensions.fontSize,
            fontWeight: 'bold',
            color: '#0066cc',
            textDecoration: 'none'
          }}
        >
          TriviaVerse
        </Box>
      )}
    </Box>
  );
};

export default Logo;
