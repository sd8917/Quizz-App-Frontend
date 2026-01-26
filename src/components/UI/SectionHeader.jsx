import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

/**
 * Reusable section header component with Chip label and Typography
 * Used across LandingPage and other pages for consistent section headers
 */
const SectionHeader = ({
  chipLabel,
  title,
  subtitle,
  chipColor = 'primary',
  chipSx = {},
  titleVariant = 'h2',
  subtitleVariant = 'h6',
  align = 'center',
  maxWidth = 600,
  sx = {},
}) => {
  return (
    <Box sx={{ textAlign: align, mb: 8, ...sx }}>
      {chipLabel && (
        <Chip
          label={chipLabel}
          color={chipColor}
          sx={{ mb: 2, fontWeight: 600, ...chipSx }}
        />
      )}
      {title && (
        <Typography variant={titleVariant} sx={{ fontWeight: 700, mb: 2 }}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography 
          variant={subtitleVariant} 
          color="text.secondary" 
          sx={{ maxWidth, mx: align === 'center' ? 'auto' : 0 }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default SectionHeader;
