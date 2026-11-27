import React from 'react';
import { Box, Typography, Chip, alpha, useTheme } from '@mui/material';

/**
 * Reusable section header component with refined EdTech eyebrow pill and typography.
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
  maxWidth = 640,
  sx = {},
}) => {
  const theme = useTheme();
  const paletteColor = theme.palette[chipColor]?.main || theme.palette.primary.main;

  return (
    <Box sx={{ textAlign: align, mb: 7, ...sx }}>
      {chipLabel && (
        <Chip
          label={chipLabel}
          size="small"
          sx={{
            mb: 2,
            px: 1,
            py: 0.5,
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            bgcolor: alpha(paletteColor, 0.1),
            color: paletteColor,
            border: `1px solid ${alpha(paletteColor, 0.22)}`,
            ...chipSx,
          }}
        />
      )}
      {title && (
        <Typography
          variant={titleVariant}
          sx={{
            fontWeight: 800,
            mb: 1.5,
            fontSize: { xs: '1.85rem', md: '2.35rem' },
            color: 'text.primary',
          }}
        >
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography
          variant={subtitleVariant}
          color="text.secondary"
          sx={{
            maxWidth,
            mx: align === 'center' ? 'auto' : 0,
            fontWeight: 400,
            fontSize: { xs: '1rem', md: '1.1rem' },
            lineHeight: 1.65,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default SectionHeader;
