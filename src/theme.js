import { createTheme } from '@mui/material/styles';

// ベースとなるテーマ設定
const baseTheme = {
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
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
};

// ライトテーマ
export const lightTheme = createTheme({
  ...baseTheme,
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
      default: '#FFFFFF',
      paper: '#F7F2FA',
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
});

// ダークテーマ
export const darkTheme = createTheme({
  ...baseTheme,
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
      paper: '#2D2C31',
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

// ブルーテーマ
export const blueTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#1976D2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#2196F3',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    background: {
      default: '#E3F2FD',
      paper: '#FFFFFF',
    },
    surface: {
      main: '#ffffff',
      variant: '#e0e0e0',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#546e7a',
    },
  },
});

// グリーンテーマ
export const greenTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1b5e20',
    },
    secondary: {
      main: '#4CAF50',
      light: '#4caf50',
      dark: '#388e3c',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    background: {
      default: '#E8F5E9',
      paper: '#FFFFFF',
    },
    surface: {
      main: '#ffffff',
      variant: '#e8f5e9',
    },
    text: {
      primary: '#1b5e20',
      secondary: '#388e3c',
    },
  },
});

// テーマの種類を定義
export const beigeTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#A67B5B',
    },
    secondary: {
      main: '#C4A484',
    },
    background: {
      default: '#F5F5DC',
      paper: '#FFFFFF',
    },
  },
});

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme,
  green: greenTheme,
  beige: beigeTheme,
};

export default lightTheme; 