import localFont from 'next/font/local';

export const instrumentSans = localFont({
  src: [
    {
      path: '../../public/fonts/instrument/InstrumentSans-Latin-Variable.woff2',
      weight: '400 700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/instrument/InstrumentSans-Latin-VariableItalic.woff2',
      weight: '400 700',
      style: 'italic',
    },
  ],
  variable: '--font-instrument-sans',
  display: 'swap',
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
});

export const instrumentSerif = localFont({
  src: [
    {
      path: '../../public/fonts/instrument/InstrumentSerif-Latin-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/instrument/InstrumentSerif-Latin-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-instrument-serif',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});
