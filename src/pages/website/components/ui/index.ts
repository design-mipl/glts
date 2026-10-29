/**
 * Website UI primitives — shadcn's component API on the Paper surface.
 *
 * Scope: `src/pages/website/` only. These are marketing/discovery primitives styled from
 * `../../theme/sitePaper`. The admin portal has its own equivalent kit at
 * `src/pages/admin/dashboard-next/shared/dashboard-ui-kit/shadcn/`; the two are
 * deliberately separate because they answer to different design systems.
 *
 * Why not literal shadcn/ui: this project has no Tailwind. Rather than introduce a second
 * styling engine alongside MUI/Emotion across an app this size, the components keep
 * shadcn's contract — Radix primitives underneath, `cva` variants, `asChild` composition,
 * the same prop names — and swap Tailwind classes for `styled()` against design tokens.
 * Anything written against shadcn's docs works here; only the styling layer differs.
 */

export { cn } from './utils'
export { Button, buttonVariants } from './button'
export type { ButtonProps } from './button'
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
export type { CardProps } from './card'
export { Badge, badgeVariants } from './badge'
export type { BadgeProps } from './badge'
export { Separator } from './separator'
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from './select'
