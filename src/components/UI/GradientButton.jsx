import React from 'react';
import { Button } from '@mui/material';

/**
 * Reusable gradient button component with consistent EdTech styling.
 */
const GradientButton = ({
  children,
  variant = 'contained',
  gradient = 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
  hoverGradient = 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
  bgcolor,
  color = '#3730a3',
  sx = {},
  ...props
}) => {
  const isGradient = variant === 'contained' && !bgcolor;

  return (
    <Button
      variant={variant}
      sx={{
        borderRadius: 2.5,
        fontWeight: 700,
        ...(isGradient && {
          background: gradient,
          color: 'white',
          boxShadow: '0 6px 18px rgba(79, 70, 229, 0.32)',
          '&:hover': {
            background: hoverGradient,
            boxShadow: '0 10px 24px rgba(79, 70, 229, 0.42)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.25s ease',
        }),
        ...(bgcolor && {
          bgcolor,
          color,
          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.16)',
          '&:hover': {
            bgcolor: '#f8fafc',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 26px rgba(15, 23, 42, 0.24)',
          },
          transition: 'all 0.25s ease',
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
