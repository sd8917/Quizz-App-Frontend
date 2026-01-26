import React from 'react';
import { Button } from '@mui/material';

/**
 * Reusable gradient button component with consistent styling
 * Used across multiple pages for primary actions
 */
const GradientButton = ({
  children,
  variant = 'contained',
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  hoverGradient = 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
  bgcolor,
  color = '#667eea',
  sx = {},
  ...props
}) => {
  const isGradient = variant === 'contained' && !bgcolor;
  
  return (
    <Button
      variant={variant}
      sx={{
        ...(isGradient && {
          background: gradient,
          color: 'white',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: hoverGradient,
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s',
        }),
        ...(bgcolor && {
          bgcolor,
          color,
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          '&:hover': {
            bgcolor: '#f3f4f6',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
          },
          transition: 'all 0.3s',
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default GradientButton;
