/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: {
        xs: '400px',
        // living-room territory — TVs and ultrawides
        '3xl': '1920px',
        '4xl': '2560px',
      },
      colors: {
        bg: 'var(--bg)',
        'bg-2': 'var(--bg-2)',
        surface: 'var(--surface)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        line: 'var(--line)',
        'line-2': 'var(--line-2)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Familjen Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      // driven by a custom property so every existing max-w-content usage
      // widens on large displays with no per-component changes
      maxWidth: { content: 'var(--content-max)' },
    },
  },
  plugins: [],
}
