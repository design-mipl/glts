import { Stack } from '@mui/material'
import type { ReactNode } from 'react'
import { Breadcrumb, type BreadcrumbItem } from '@/design-system/UIComponents'
import { ADMIN_FULL_PAGE_FORM_LAYOUT } from './adminFullPageFormLayout'
import { AdminHeaderChrome } from './AdminHeaderChrome'

export interface AdminRecordPageChromeProps {
  breadcrumbs: BreadcrumbItem[]
  children: ReactNode
  /** Optional page actions rendered on the breadcrumb row (before search/profile). */
  actions?: ReactNode
  /** When false, omits search + profile chrome. Default true. */
  showChrome?: boolean
}

/**
 * Breadcrumb with back affordance above full-page forms, stepper forms, and detail modules.
 * Parent crumbs must include `href` so the back control navigates to the listing/parent route.
 * Desktop: search + profile sit on the breadcrumb row; mobile uses AppShell MobileNavStrip.
 */
export function AdminRecordPageChrome({
  breadcrumbs,
  children,
  actions,
  showChrome = true,
}: AdminRecordPageChromeProps) {
  const chrome = showChrome ? <AdminHeaderChrome /> : null
  const endActions =
    actions || chrome ? (
      <Stack direction="row" alignItems="center" spacing={1.5} flexShrink={0} flexWrap="wrap" useFlexGap>
        {actions}
        {chrome}
      </Stack>
    ) : null

  return (
    <Stack spacing={ADMIN_FULL_PAGE_FORM_LAYOUT.pageStackGap}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Breadcrumb items={breadcrumbs} sx={{ mb: 0, minWidth: 0, flex: 1 }} />
        {endActions}
      </Stack>
      {children}
    </Stack>
  )
}
