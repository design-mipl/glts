import { forwardRef } from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { styled } from '@mui/material/styles'
import { cn } from './utils'

const Root = styled(SeparatorPrimitive.Root)(({ theme, orientation }) => ({
  flexShrink: 0,
  backgroundColor: theme.palette.divider,
  ...(orientation === 'horizontal'
    ? { height: 1, width: '100%' }
    : { width: 1, height: '100%' }),
}))

export const Separator = forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn('dui-separator', className)}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName
