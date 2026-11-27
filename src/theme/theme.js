import { createTheme } from '@mui/material/styles';

const headingFont = '"Plus Jakarta Sans", "Inter", "Helvetica", "Arial", sans-serif';
const bodyFont = '"Inter", "Roboto", "Helvetica", "Arial", sans-serif';

// Modern EdTech color palette & design tokens
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1050, // Custom size between md (900px) and original lg (1200px)
      xl: 1536,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5', // Deep Academic Indigo
      light: '#818cf8',
      dark: '#3730a3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0d9488', // Scholarly Teal
      light: '#2dd4bf',
      dark: '#0f766e',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#0284c7',
      light: '#38bdf8',
      dark: '#0369a1',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    divider: 'rgba(15, 23, 42, 0.08)',
  },
  typography: {
    fontFamily: bodyFont,
    h1: {
      fontFamily: headingFont,
      fontSize: '2.75rem',
      fontWeight: 800,
      lineHeight: 1.15,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontFamily: headingFont,
      fontSize: '2.125rem',
      fontWeight: 800,
      lineHeight: 1.22,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: headingFont,
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.015em',
    },
    h4: {
      fontFamily: headingFont,
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.35,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontFamily: headingFont,
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: headingFont,
      fontSize: '1.05rem',
      fontWeight: 700,
      lineHeight: 1.45,
    },
    button: {
      fontFamily: headingFont,
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(15, 23, 42, 0.05), 0px 1px 2px rgba(15, 23, 42, 0.03)',
    '0px 4px 12px rgba(15, 23, 42, 0.05), 0px 2px 4px rgba(15, 23, 42, 0.03)',
    '0px 8px 20px rgba(15, 23, 42, 0.06), 0px 2px 6px rgba(15, 23, 42, 0.04)',
    '0px 12px 28px rgba(15, 23, 42, 0.08)',
    '0px 16px 34px rgba(15, 23, 42, 0.09)',
    '0px 18px 38px rgba(15, 23, 42, 0.10)',
    '0px 20px 42px rgba(15, 23, 42, 0.11)',
    '0px 22px 46px rgba(15, 23, 42, 0.12)',
    '0px 24px 50px rgba(15, 23, 42, 0.13)',
    '0px 26px 54px rgba(15, 23, 42, 0.14)',
    '0px 28px 58px rgba(15, 23, 42, 0.15)',
    '0px 30px 62px rgba(15, 23, 42, 0.16)',
    '0px 32px 66px rgba(15, 23, 42, 0.17)',
    '0px 34px 70px rgba(15, 23, 42, 0.18)',
    '0px 36px 74px rgba(15, 23, 42, 0.19)',
    '0px 38px 78px rgba(15, 23, 42, 0.20)',
    '0px 40px 82px rgba(15, 23, 42, 0.21)',
    '0px 42px 86px rgba(15, 23, 42, 0.22)',
    '0px 44px 90px rgba(15, 23, 42, 0.23)',
    '0px 46px 94px rgba(15, 23, 42, 0.24)',
    '0px 48px 98px rgba(15, 23, 42, 0.25)',
    '0px 50px 102px rgba(15, 23, 42, 0.26)',
    '0px 52px 106px rgba(15, 23, 42, 0.27)',
    '0px 54px 110px rgba(15, 23, 42, 0.28)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 22px',
          fontSize: '0.95rem',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(79, 70, 229, 0.18)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 8px 18px rgba(79, 70, 229, 0.25)',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: 'rgba(15, 23, 42, 0.14)',
            },
            '&:hover fieldset': {
              borderColor: '#4f46e5',
            },
          },
        },
      },
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(15, 23, 42, 0.08)',
          boxShadow: '0px 4px 16px rgba(15, 23, 42, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(15, 23, 42, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 0px rgba(15, 23, 42, 0.08)',
          borderRadius: 0,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
