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
        dark: '#202124', // Website background color (dark mode)
        accentLight: '#264653', //'#004c98',
        accentDark: '#F4A261', // #32d2d8
        accent: '#2A9D8F',
        accentDarker: '#E9C46A', // #008080
        button: '#E76F51',
        darkHead: '#1B1B1B',
        darkButton: '#272E23',
        lightButton: '#F3F6FC',
        bgSP: '#F3F6FC',
        bgSpDark: '#282A2C',
        lightHead: '#f0f0f0', // ModelBg in mui theme
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