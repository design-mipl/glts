import { forwardRef } from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { styled, alpha } from '@mui/material/styles'
import { tokens } from '@/design-system/tokens'
import { cn } from './utils'

const Root = styled(TabsPrimitive.Root)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const List = styled(TabsPrimitive.List)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  width: '100%',
}))

const Trigger = styled(TabsPrimitive.Trigger)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  whiteSpace: 'nowrap',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: tokens.fontSize.sm,
  fontWeight: 600,
  color: theme.palette.text.secondary,
  padding: theme.spacing(1.25, 1.5),
  marginBottom: -1,
  borderBottom: '2px solid transparent',
  transition: `color ${tokens.transition.fast}, border-color ${tokens.transition.fast}, background ${tokens.transition.fast}`,
  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  '&[data-state="active"]': {
    color: theme.palette.text.primary,
    borderBottomColor: theme.palette.primary.main,
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
  '&:disabled': {
    opacity: 0.45,
    cursor: 'not-allowed',
  },
}))

const Content = styled(TabsPrimitive.Content)(({ theme }) => ({
  marginTop: theme.spacing(2),
  outline: 'none',
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}))

export const Tabs = Root
export const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <List ref={ref} className={cn('dui-tabs-list', className)} {...props} />
))
TabsList.displayName = TabsPrimitive.List.displayName

export const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <Trigger ref={ref} className={cn('dui-tabs-trigger', className)} {...props} />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

export const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <Content ref={ref} className={cn('dui-tabs-content', className)} {...props} />
))
TabsContent.displayName = TabsPrimitive.Content.displayName
