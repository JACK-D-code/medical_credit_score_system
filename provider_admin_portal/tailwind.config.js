/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          border: 'var(--color-border)',
          input: 'var(--color-input)',
          ring: 'var(--color-ring)',
          background: 'var(--color-background)',
          foreground: 'var(--color-foreground)',
          primary: {
            DEFAULT: 'var(--color-primary)', /* teal-700 */
            foreground: 'var(--color-primary-foreground)' /* white */
          },
          secondary: {
            DEFAULT: 'var(--color-secondary)', /* teal-500 */
            foreground: 'var(--color-secondary-foreground)' /* white */
          },
          accent: {
            DEFAULT: 'var(--color-accent)', /* amber-400 */
            foreground: 'var(--color-accent-foreground)' /* gray-900 */
          },
          destructive: {
            DEFAULT: 'var(--color-destructive)', /* red-600 */
            foreground: 'var(--color-destructive-foreground)' /* white */
          },
          success: {
            DEFAULT: 'var(--color-success)', /* green-600 */
            foreground: 'var(--color-success-foreground)' /* white */
          },
          warning: {
            DEFAULT: 'var(--color-warning)', /* yellow-600 */
            foreground: 'var(--color-warning-foreground)' /* gray-900 */
          },
          error: {
            DEFAULT: 'var(--color-error)', /* red-600 */
            foreground: 'var(--color-error-foreground)' /* white */
          },
          muted: {
            DEFAULT: 'var(--color-muted)', /* gray-100 */
            foreground: 'var(--color-muted-foreground)' /* gray-600 */
          },
          card: {
            DEFAULT: 'var(--color-card)', /* white */
            foreground: 'var(--color-card-foreground)' /* gray-700 */
          },
          popover: {
            DEFAULT: 'var(--color-popover)', /* white */
            foreground: 'var(--color-popover-foreground)' /* gray-700 */
          }
        },
        borderRadius: {
          sm: 'var(--radius-sm)',
          md: 'var(--radius-md)',
          lg: 'var(--radius-lg)',
          xl: 'var(--radius-xl)'
        },
        fontFamily: {
          heading: ['Lexend', 'sans-serif'],
          body: ['Source Sans 3', 'sans-serif'],
          caption: ['Inter', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace']
        },
        spacing: {
          '18': '4.5rem',
          '72': '18rem',
          '96': '24rem',
          '144': '36rem'
        },
        maxWidth: {
          'prose': '70ch'
        },
        transitionDuration: {
          '250': '250ms'
        },
        transitionTimingFunction: {
          'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        },
        keyframes: {
          pulse: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.5' }
          },
          spring: {
            '0%': { transform: 'scale(0.8)' },
            '50%': { transform: 'scale(1.05)' },
            '100%': { transform: 'scale(1)' }
          }
        },
        animation: {
          'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'spring': 'spring 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }
      }
    },
    plugins: [
      require('@tailwindcss/typography'),
      require('@tailwindcss/forms'),
      require('tailwindcss-animate')
    ]
  }