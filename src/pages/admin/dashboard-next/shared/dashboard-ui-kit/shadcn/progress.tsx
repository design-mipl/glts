import { forwardRef } from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { styled } from '@mui/material/styles'
import { tokens } from '@/design-system/tokens'
import { cn } from './utils'

const Root = styled(ProgressPrimitive.Root)(({ theme }) => ({
  position: 'relative',
  height: 8,
  width: '100%',
  overflow: 'hidden',
  borderRadius: tokens.borderRadius.full,
  backgroundColor: theme.palette.action.hover,
}))

const Indicator = styled(ProgressPrimitive.Indicator)<{ tone?: string }>(({ theme, tone }) => {
  const color =
    tone === 'success'
      ? theme.palette.success.main
      : tone === 'warning'
        ? theme.palette.warning.main
        : tone === 'error'
          ? theme.palette.error.main
          : theme.palette.primary.main

  return {
    height: '100%',
    width: '100%',
    flex: 1,
    backgroundColor: color,
    transition: `transform ${tokens.transition.slow}`,
    borderRadius: tokens.borderRadius.full,
  }
})

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number
  tone?: 'default' | 'success' | 'warning' | 'error'
}

export const Progress = forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, tone = 'default', ...props }, ref) => (
  <Root
    ref={ref}
    className={cn('dui-progress', className)}
    value={value}
    {...props}
  >
    <Indicator
      tone={tone}
      style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
    />
  </Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName
