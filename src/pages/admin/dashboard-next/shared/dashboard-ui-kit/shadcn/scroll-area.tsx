import { forwardRef } from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { styled } from '@mui/material/styles'
import { cn } from './utils'

const Root = styled(ScrollAreaPrimitive.Root)({
  position: 'relative',
  overflow: 'hidden',
})

const Viewport = styled(ScrollAreaPrimitive.Viewport)({
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
})

const Scrollbar = styled(ScrollAreaPrimitive.Scrollbar)(({ theme, orientation }) => ({
  display: 'flex',
  touchAction: 'none',
  userSelect: 'none',
  padding: 2,
  transition: 'background 160ms ease',
  ...(orientation === 'vertical'
    ? { height: '100%', width: 10, borderLeft: `1px solid ${theme.palette.divider}` }
    : {
        height: 10,
        flexDirection: 'column' as const,
        borderTop: `1px solid ${theme.palette.divider}`,
      }),
}))

const Thumb = styled(ScrollAreaPrimitive.Thumb)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.palette.action.disabled,
  borderRadius: 999,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: 44,
    minHeight: 44,
  },
}))

export const ScrollArea = forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <Root ref={ref} className={cn('dui-scroll-area', className)} {...props}>
    <Viewport>{children}</Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

export const ScrollBar = forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn('dui-scrollbar', className)}
    {...props}
  >
    <Thumb />
  </Scrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName
