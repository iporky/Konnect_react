import { createTheme } from '@mui/material/styles';

const primaryColor = '#1d4484';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryColor,
      light: '#8ae5e9',
      dark: '#3ba3a8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c43e59',
      light: '#f06b88',
      dark: '#8b2a3e',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#6c757d',
    },
    divider: '#e9ecef',
  },
  typography: {
    fontFamily: 'Metropolis, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontWeightRegular: 400,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#2c3e50',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#2c3e50',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#2c3e50',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      color: '#2c3e50',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      color: '#2c3e50',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      color: '#2c3e50',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(87, 209, 214, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(87, 209, 214, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
          },
        },
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
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primaryColor,
      light: '#8ae5e9',
      dark: '#3ba3a8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c43e59',
      light: '#f06b88',
      dark: '#8b2a3e',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    divider: '#333333',
  },
  typography: {
    fontFamily: 'Metropolis, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontWeightRegular: 400,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#ffffff',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#ffffff',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#ffffff',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      color: '#ffffff',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      color: '#ffffff',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      color: '#ffffff',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(87, 209, 214, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(87, 209, 214, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#1e1e1e',
          boxShadow: '0 2px 16px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
          },
        },
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
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
        },
      },
    },
  },
});
