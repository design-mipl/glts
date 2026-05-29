import { Stack } from '@mui/material'
import type { ReactNode } from 'react'
import { Breadcrumb, type BreadcrumbItem } from '@/design-system/UIComponents'
import { ADMIN_FULL_PAGE_FORM_LAYOUT } from './adminFullPageFormLayout'

export interface AdminRecordPageChromeProps {
  breadcrumbs: BreadcrumbItem[]
  children: ReactNode
}

/**
 * Breadcrumb with back affordance above full-page forms, stepper forms, and detail modules.
 * Parent crumbs must include `href` so the back control navigates to the listing/parent route.
 */
export function AdminRecordPageChrome({ breadcrumbs, children }: AdminRecordPageChromeProps) {
  return (
    <Stack spacing={ADMIN_FULL_PAGE_FORM_LAYOUT.pageStackGap}>
      <Breadcrumb items={breadcrumbs} />
      {children}
    </Stack>
  )
}
