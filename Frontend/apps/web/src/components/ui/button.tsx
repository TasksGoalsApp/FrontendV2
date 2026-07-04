import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-[filter,transform,background-color,color,box-shadow] duration-150 ease-out active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary CTA — neutral black/white (inverts in dark)
        default: 'bg-primary text-primary-foreground hover:brightness-95',
        // Lime — reserved for hero / onboarding CTAs
        lime: 'bg-brand-lime font-semibold text-brand-lime-foreground hover:brightness-95',
        // Outline — the OAuth / quiet action button
        outline: 'border border-border bg-card text-foreground hover:bg-secondary',
        secondary:
          'border border-border bg-secondary text-secondary-foreground hover:brightness-95',
        ghost: 'text-foreground hover:bg-secondary',
        destructive:
          'bg-destructive text-destructive-foreground hover:brightness-95',
        link: 'text-foreground underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3',
        lg: 'h-11 px-5 text-sm',
        icon: 'size-9',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
