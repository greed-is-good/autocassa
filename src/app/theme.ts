import { alpha, createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1f73f2',
      dark: '#123b84',
      light: '#7ebcff',
    },
    secondary: {
      main: '#ff7a1a',
      dark: '#c74507',
      light: '#ffd9a9',
    },
    success: {
      main: '#1f8f66',
    },
    warning: {
      main: '#d97706',
    },
    error: {
      main: '#c2410c',
    },
    background: {
      default: '#f5f8fc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#60708a',
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: '"Manrope", system-ui, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body2: {
      lineHeight: 1.65,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          paddingInline: 18,
          boxShadow: 'none',
        },
        containedPrimary: {
          boxShadow: '0 18px 30px rgba(31, 115, 242, 0.16)',
          '&:hover': {
            boxShadow: '0 22px 36px rgba(31, 115, 242, 0.22)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#ffffff', 0.84),
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: '1px solid rgba(15, 23, 42, 0.08)',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
        },
      },
    },
  },
})
