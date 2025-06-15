import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6750A4',
      light: '#D0BCFF',
      dark: '#4F378B',
    },
    secondary: {
      main: '#625B71',
      light: '#E8DEF8',
      dark: '#4A4458',
    },
    error: {
      main: '#B3261E',
      light: '#F2B8B5',
      dark: '#8C1D18',
    },
    background: {
      default: '#FFFBFE',
      paper: '#FFFBFE',
    },
    surface: {
      main: '#FFFBFE',
      variant: '#E7E0EC',
    },
    text: {
      primary: '#1C1B1F',
      secondary: '#49454F',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 400,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 400,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 20,
          padding: '8px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#D0BCFF',
      light: '#E8DEF8',
      dark: '#6750A4',
    },
    secondary: {
      main: '#CCC2DC',
      light: '#E8DEF8',
      dark: '#625B71',
    },
    error: {
      main: '#F2B8B5',
      light: '#F9DEDC',
      dark: '#B3261E',
    },
    background: {
      default: '#1C1B1F',
      paper: '#1C1B1F',
    },
    surface: {
      main: '#1C1B1F',
      variant: '#49454F',
    },
    text: {
      primary: '#E6E1E5',
      secondary: '#CAC4D0',
    },
  },
});

export default theme; 