import typography from '@tailwindcss/typography'
import daisyui from 'daisyui'

import type {Config} from 'tailwindcss'

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    fontFamily: {
      gravesend: ['gravesend-sans', 'sans-serif'],
      basic: ['basic-sans', 'sans-serif']
    }
  },
  daisyui: {
    themes: [
      {
        zonasul: {
          primary: '#009c3b',
          secondary: '#ffdf00',
          accent: '#002776',
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
    ]
  },
  plugins: [typography, daisyui]
} satisfies Config
