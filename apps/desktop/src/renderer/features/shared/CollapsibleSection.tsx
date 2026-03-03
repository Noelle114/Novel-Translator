import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { CollapsibleSectionProps } from '../../app/types'

export function CollapsibleSection({
  children,
  className,
  defaultOpen = false,
  hideLabel,
  showLabel,
  title
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <section className={cn('rounded-xl border border-border/70 bg-card/60', className)}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-sm font-semibold">{title}</span>
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          {isOpen ? hideLabel : showLabel}
          <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen ? 'rotate-180' : 'rotate-0')} />
        </span>
      </button>
      <div
        id={contentId}
        className={cn(
          'overflow-hidden border-t border-border/70 px-4 transition-all duration-200',
          isOpen ? 'max-h-[2000px] py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
        )}
      >
        {children}
      </div>
    </section>
  )
}
