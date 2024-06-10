import { blue, purple, blueGrey } from '@mui/material/colors';
import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

const mui = extendTheme({
  cssVarPrefix: 'rb',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#121212'
        },
        accent: {
          main: '#264653',
        },
        icon: {
          main: blueGrey[900]
        },
        rbSlate: {
          main: blueGrey[200]
        },
        lightGray: {
          main: '#e5e6f0'
        },
        ld: {
          main: '#fafafa'
        },
        bgSP: { main: '#F3F6FC' },
        button: { main: '#E76F51' },
        modelBG: { main: '#f0f0f0' },
        switch: { main: '#000', contrastText: '#fff', accent: '#264653'},
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#fafafa'
        },
        accent: {
          main: '#F4A261', // #32d2d8
        },
        icon: {
          main: '#fafafa'
        },
        rbSlate: {
          main: blueGrey[700]
        },
        lightGray: {
          main: blueGrey[800]
        },
        ld: {
          main: '#212121'
        },
        background: {
          main: '#202124'
        },
        button: { main: '#E76F51' },
        modelBG: { main: '#1B1B1B' },
        bgSP: { main: '#282A2C' },
        switch: { main: '#fff', contrastText: '#000', accent: '#F4A261'},
      }
    }
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'rb-franklin, serif !important',
    body1: {
      fontFamily: 'rb-franklin, serif',
      textTransform: 'none',
    },
    body2: {
      fontFamily: 'rb-franklin, serif',
      textTransform: 'none',
    },
    button: {
      fontFamily: 'rb-franklin, serif',
      textTransform: 'none',
    },
    rbBtns: {
      fontFamily: 'rb-cheltenham, serif',
      textTransform: 'none',
    },
  },
});

export default mui;
