import React from 'react';
import { Box } from '@mui/material';

/**
 * Reusable gradient background component with SVG pattern overlay
 * Used across LandingPage, Login, Register, and other pages
 */
const GradientBackground = ({ 
  children, 
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  minHeight = '100vh',
  padding,
  sx = {},
  ...props 
}) => {
  return (
    <Box
      sx={{
        minHeight,
        display: 'flex',
        padding: padding || { xs: '20px 16px', sm: '30px 24px', md: '50px' },
        background: gradient,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.4,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default GradientBackground;
