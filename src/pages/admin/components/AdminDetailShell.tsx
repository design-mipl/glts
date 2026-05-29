import { Stack } from '@mui/material'
import type { ReactNode } from 'react'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import { ADMIN_FULL_PAGE_FORM_LAYOUT } from './adminFullPageFormLayout'
import { AdminRecordPageChrome } from './AdminRecordPageChrome'

export interface AdminDetailShellProps {
  breadcrumbs: BreadcrumbItem[]
  /** Summary / identity card (title, badges, primary actions) */
  summary: ReactNode
  /** Main workspace (tabs card, timeline, etc.) */
  children: ReactNode
}

/**
 * Detail module layout: breadcrumb + back · summary card · main content card(s).
 */
export function AdminDetailShell({ breadcrumbs, summary, children }: AdminDetailShellProps) {
  return (
    <AdminRecordPageChrome breadcrumbs={breadcrumbs}>
      <Stack spacing={ADMIN_FULL_PAGE_FORM_LAYOUT.pageStackGap}>
        {summary}
        {children}
      </Stack>
    </AdminRecordPageChrome>
  )
}
