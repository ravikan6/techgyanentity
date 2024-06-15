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
        secondary: {
          main: 'rgb(241, 162, 162)', // Wewak
        },
        accent: {
          main: 'rgb(213, 118, 108)', // Japonica
        },
        icon: {
          main: blueGrey[900]
        },
        rbSlate: {
          main: blueGrey[200]
        },
        lightGray: {
          main: '#fd586a'
        },
        ld: {
          main: '#fafafa'
        },
        bgSP: {
          main: 'rgb(141, 155, 180)', // Bali Hai
        },
        button: {
          main: 'rgb(243, 196, 185)', // Mandys Pink
        },
        modelBG: {
          main: 'rgb(253, 236, 236)', // Wisp Pink
        },
        switch: { main: '#000', contrastText: '#fff', accent: '#176766' },
        background: {
          main: '#1e1a28',
          paper: 'rgb(253, 236, 236)', // Wisp Pink
        },
        Avatar: {
          defaultBg: 'rgb(241, 162, 162)', // Wewak
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#fafafa'
        },
        secondary: {
          main: 'rgb(182, 184, 190)', // Bombay
        },
        accent: {
          main: 'rgb(57, 101, 137)', // Ming
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
          main: '#1e1a28'
        },
        background: {
          main: '#1e1a28',
          paper: 'rgb(26, 45, 76)', // Big Stone
        },
        button: {
          main: 'rgb(75, 90, 129)', // Blue Bayoux
        },
        modelBg: {
          main: 'rgb(26, 45, 76)', // Big Stone
        },
        bgSP: {
          main: 'rgb(89, 44, 59)' // Livid Brown
        },
        switch: { main: '#fff', contrastText: '#000', accent: '#bb6eff' },
        Avatar: {
          defaultBg: 'rgb(182, 184, 190)', // Bombay
        }
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
