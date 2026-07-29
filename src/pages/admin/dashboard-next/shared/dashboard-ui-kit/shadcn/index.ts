/**
 * Internal shadcn-style primitives for Dashboard UI Kit.
 *
 * NOT part of the public Dashboard UI Kit API — widgets and dashboards
 * must import from `../dashboard-ui-kit` (or sibling barrels), never here.
 *
 * Built on Radix + CVA; visual values come from Design System / MUI theme.
 */

export { cn } from './utils'
export { Button, buttonVariants } from './button'
export type { ButtonProps } from './button'
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from './card'
export type { CardProps } from './card'
export { Badge, badgeVariants } from './badge'
export type { BadgeProps } from './badge'
export { Separator } from './separator'
export { Skeleton } from './skeleton'
export { Progress } from './progress'
export { Alert, AlertTitle, AlertDescription } from './alert'
export { ScrollArea, ScrollBar } from './scroll-area'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible'
