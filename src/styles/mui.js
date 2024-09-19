import { blue, purple, blueGrey } from '@mui/material/colors';
import { createTheme, extendTheme } from '@mui/material/styles';

const mui = createTheme({
  cssVarPrefix: 'rb',
  cssVariables: {
    colorSchemeSelector: 'class',
  },
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
          main: 'rgb(89, 44, 59)' // Livid Brown
        },
        button: {
          main: 'rgb(213, 118, 108)', // Japonica
        },
        Button: {
          inheritContainedBg: 'rgb(213, 118, 108)', // Japonica
        },
        // modelBg: {
        //   main: 'rgb(253, 236, 236)', // Wisp Pink
        // },
        // switch: { main: '#000', contrastText: '#fff', accent: '#176766' },
        background: {
          main: '#1e1a28',
          paper: 'rgb(253, 236, 236)', // Wisp Pink
          default: 'rgb(253, 236, 236)', // Wisp Pink 
        },
        Avatar: {
          defaultBg: 'rgb(241, 162, 162)', // Wewak
        },
        head: {
          main: 'rgb(249, 222, 210)', // Givry
        },
        button2: {
          main: 'rgb(243, 196, 185)', // Mandys Pink
        },
        TableCell: {
          border: 'rgb(249, 222, 210)', // Givry
        },
        common: {
          background: 'rgb(253, 236, 236)', // Wisp Pink 
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
          default: 'rgb(26, 45, 76)', // Big Stone
        },
        button: {
          main: 'rgb(198, 215, 240)', // Spindle
        },
        Button: {
          inheritContainedBg: 'rgb(198, 215, 240)', // Spindle
        },
        // modelBg: {
        //   main: 'rgb(26, 45, 76)', // Big Stone
        // },
        bgSP: {
          main: 'rgb(198, 215, 240)', // Spindle
          // main: 'rgb(141, 155, 180)', // Bali Hai
        },
        // switch: { main: '#fff', contrastText: '#000', accent: '#bb6eff' },
        Avatar: {
          defaultBg: 'rgb(182, 184, 190)', // Bombay
        },
        head: {
          main: 'rgb(11, 31, 60)', // Blue Zodiac
        },
        button2: {
          main: 'rgb(75, 90, 129)', // Blue Bayoux
        },
        TableCell: {
          border: 'rgb(11, 31, 60)', // Blue Zodiac
        },
        common: {
          background: 'rgb(26, 45, 76)', // Big Stone
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
