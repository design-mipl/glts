import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { styled } from '@mui/material/styles'
import { paper } from '../../theme/sitePaper'
import { cn } from './utils'

const StyledSeparator = styled(SeparatorPrimitive.Root)({
  flexShrink: 0,
  backgroundColor: paper.hairline,
  '&[data-orientation="horizontal"]': { height: 1, width: '100%' },
  '&[data-orientation="vertical"]': { width: 1, alignSelf: 'stretch' },
})

/**
 * Hairline rule. Defaults to `decorative`, which keeps it out of the accessibility tree —
 * correct for a visual divider. Pass `decorative={false}` only when the rule genuinely
 * separates two thematic groups a screen reader should hear about.
 */
export const Separator = forwardRef<
  ElementRef<typeof SeparatorPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <StyledSeparator
    ref={ref}
    className={cn('gl-separator', className)}
    orientation={orientation}
    decorative={decorative}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName
