import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium', {
  variants: {
    variant: {
      pending: 'border-transparent bg-muted text-muted-foreground',
      translating: 'border-transparent bg-accent text-accent-foreground',
      translated: 'border-transparent bg-secondary text-secondary-foreground',
      edited: 'border-transparent bg-secondary text-secondary-foreground',
      approved: 'border-primary/20 bg-primary/15 text-primary',
      locked: 'border-transparent bg-muted text-muted-foreground',
      skipped: 'border-transparent bg-secondary text-secondary-foreground',
      unresolved: 'border-transparent bg-accent/70 text-accent-foreground',
      error: 'border-transparent bg-destructive text-destructive-foreground'
    }
  },
  defaultVariants: {
    variant: 'pending'
  }
})

type BadgeProps = {
  className?: string
  label?: string
} & VariantProps<typeof badgeVariants>

export function Badge({ className, label, variant }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{label ?? variant}</span>
}
