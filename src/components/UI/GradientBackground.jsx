import React from 'react';
import { Box } from '@mui/material';

/**
 * Reusable EdTech gradient background component with subtle academic grid and ambient glows.
 * Used across LandingPage, Login, Register, and auth flows.
 */
const GradientBackground = ({
  children,
  gradient = 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 48%, #312e81 100%)',
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
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 18% 20%, rgba(79, 70, 229, 0.35) 0%, transparent 45%), radial-gradient(circle at 82% 78%, rgba(13, 148, 136, 0.28) 0%, transparent 48%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
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
