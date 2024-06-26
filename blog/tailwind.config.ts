import typography from '@tailwindcss/typography'
import daisyui from 'daisyui'

import type {Config} from 'tailwindcss'

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    fontFamily: {
      gravesend: ['gravesend-sans', 'sans-serif'],
      basic: ['basic-sans', 'sans-serif']
    },
    extend: {
      colors: {
        whiteBelt: '#FFFFFF',
        blueBelt: '#0000FF',
        purpleBelt: '#800080',
        brownBelt: '#964B00',
        blackBelt: '#000000'
      }
    }
  },
  safelist: [
    'sm:col-start-1',
    'sm:col-start-2',
    'sm:col-start-3',
    'sm:col-start-4',
    'sm:col-start-5',
    'sm:col-start-6',
    'sm:col-start-7'
  ],
  daisyui: {
    themes: [
      {
        zonasul: {
          'base-100': '#ffffff',
          neutral: '#000000',
          'neutral-content': '#ffffff',
          '--rounded-box': '0',
          '--rounded-btn': '0',
          '--rounded-badge': '0',
          '--animation-btn': '0',
          '--animation-input': '0',
          '--btn-focus-scale': '1',
          '--tab-radius': '0'
        }
      }
    ],
    logs: false
  },
  plugins: [typography, daisyui]
} satisfies Config
