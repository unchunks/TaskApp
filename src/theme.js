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
    },
    secondary: {
      main: '#625B71',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F7F2FA',
    },
    priority: {
      1: '#2196F3', // 青
      2: '#4CAF50', // 緑
      3: '#FFC107', // 黄色
      4: '#FF9800', // オレンジ
      5: '#FF5252', // 赤
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
    },
    secondary: {
      main: '#CCC2DC',
    },
    background: {
      default: '#1C1B1F',
      paper: '#2D2C31',
    },
    priority: {
      1: '#64B5F6', // 明るい青
      2: '#81C784', // 明るい緑
      3: '#FFD54F', // 明るい黄色
      4: '#FFB74D', // 明るいオレンジ
      5: '#FF8A80', // 明るい赤
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
    },
    secondary: {
      main: '#2196F3',
    },
    background: {
      default: '#E3F2FD',
      paper: '#FFFFFF',
    },
    priority: {
      1: '#42A5F5', // 青
      2: '#66BB6A', // 緑
      3: '#FFB300', // 黄色
      4: '#FF7043', // オレンジ
      5: '#EF5350', // 赤
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
    },
    secondary: {
      main: '#4CAF50',
    },
    background: {
      default: '#E8F5E9',
      paper: '#FFFFFF',
    },
    priority: {
      1: '#1976D2', // 深い青
      2: '#388E3C', // 深い緑
      3: '#FBC02D', // 深い黄色
      4: '#F57C00', // 深いオレンジ
      5: '#D32F2F', // 深い赤
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
    priority: {
      1: '#9B8EA9', // ベージュ系の青
      2: '#A7B388', // ベージュ系の緑
      3: '#E9EDC9', // ベージュ系の黄色
      4: '#D4A373', // ベージュ系のオレンジ
      5: '#B76E79', // ベージュ系の赤
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