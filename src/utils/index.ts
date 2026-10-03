import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teaches tailwind-merge the design-system token names (src/app/globals.css). Without it, a type token such as
// `text-label` reads as a colour, so cn('text-label', 'text-ink') drops the size, and `space-N` steps never merge.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'display',
        'h1',
        'h2',
        'h3',
        'body-lg',
        'body',
        'small',
        'label',
        'eyebrow',
        'code',
        'numeral',
        'display-ar',
        'h2-ar',
        'body-ar',
      ],
      spacing: [
        'space-1',
        'space-2',
        'space-3',
        'space-4',
        'space-5',
        'space-6',
        'space-7',
        'space-8',
        'space-9',
        'space-10',
        'nav',
      ],
      shadow: ['glow'],
      container: ['page', 'measure'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
