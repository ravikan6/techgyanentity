/** @type {import('tailwindcss/plugin')} */
/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class'],
  theme: {
    // screens: {
    //   // sm: '640px',
    //   // md: '768px',
    //   // lg: '1024px',
    //   // xl: '1280px',
    //   // '2xl': '1536px',
    //   sp: '320px',
    // },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        dark: 'rgb(26, 45, 76)', // Big Stone -- Website background color (dark mode)
        accentLight: 'rgb(213, 118, 108)', // Japonica
        accentDark: 'rgb(57, 101, 137)', // Ming
        accent: 'rgb(213, 118, 108)', // Japonica
        accentDarker: 'rgb(57, 101, 137)', // Ming
        button: 'rgb(230, 184, 178)', // Rose fog
        darkHead: 'rgb(11, 31, 60)', // Blue Zodiac
        darkButton: 'rgb(75, 90, 129)', // Blue Bayoux
        lightButton: 'rgb(243, 196, 185)', // Mandys Pink
        bgSP: 'rgb(221, 146, 136)', // Petite Orchid
        bgSpDark: 'rgb(89, 44, 59)', // Livid Brown
        lightHead: 'rgb(249, 222, 210)', // Givry
        secondary: 'rgb(241, 162, 162)', // Wewak
        secondaryDark: 'rgb(182, 184, 190)', // Bombay
        light: 'rgb(253, 236, 236)', // Wisp Pink
      },
    },
  },
  // prefix: 'rb-',
  // corePlugins: {
  //   preflight: false,
  // },
  plugins: [
    plugin(({ addVariant }) => {
      [
        'active',
        'checked',
        'completed',
        'disabled',
        'readOnly',
        'error',
        'expanded',
        'focused',
        'required',
        'selected',
      ].forEach((state) => {
        addVariant(`ui-${state}`, [`&[class~="rb-${state}"]`]);

        addVariant(`ui-not-${state}`, [`&:not([class~="rb-${state}"])`]);
      });
      addVariant(`ui-focus-visible`, [`&[class~="rb-focusVisible"]`, `&:focus-visible`]);
      addVariant(`ui-not-focus-visible`, [`&:not([class~="rb-focusVisible"])`]);
    }),
  ],
}