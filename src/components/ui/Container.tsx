import type { ComponentProps } from 'react'
import { cn } from '@/utils'

// The page container: 1200px with space-4 gutters on mobile, space-6 on desktop (design-system README: Layout & spacing).
export function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-page px-space-4 md:px-space-6', className)} {...props} />
}
