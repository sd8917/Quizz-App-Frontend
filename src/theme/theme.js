import { createTheme } from '@mui/material/styles';

// Custom color palette
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
      main: '#6366f1', // Indigo
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899', // Pink
      light: '#f472b6',
      dark: '#db2777',
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
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 6px rgba(0,0,0,0.07)',
    '0px 6px 10px rgba(0,0,0,0.08)',
    '0px 8px 14px rgba(0,0,0,0.09)',
    '0px 10px 18px rgba(0,0,0,0.10)',
    '0px 12px 22px rgba(0,0,0,0.11)',
    '0px 14px 26px rgba(0,0,0,0.12)',
    '0px 16px 30px rgba(0,0,0,0.13)',
    '0px 18px 34px rgba(0,0,0,0.14)',
    '0px 20px 38px rgba(0,0,0,0.15)',
    '0px 22px 42px rgba(0,0,0,0.16)',
    '0px 24px 46px rgba(0,0,0,0.17)',
    '0px 26px 50px rgba(0,0,0,0.18)',
    '0px 28px 54px rgba(0,0,0,0.19)',
    '0px 30px 58px rgba(0,0,0,0.20)',
    '0px 32px 62px rgba(0,0,0,0.21)',
    '0px 34px 66px rgba(0,0,0,0.22)',
    '0px 36px 70px rgba(0,0,0,0.23)',
    '0px 38px 74px rgba(0,0,0,0.24)',
    '0px 40px 78px rgba(0,0,0,0.25)',
    '0px 42px 82px rgba(0,0,0,0.26)',
    '0px 44px 86px rgba(0,0,0,0.27)',
    '0px 46px 90px rgba(0,0,0,0.28)',
    '0px 48px 94px rgba(0,0,0,0.29)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.975rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0,0,0,0.12)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0,0,0,0.15)',
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
            borderRadius: 8,
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
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0,0,0,0.08)',
          borderRadius: 0,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
