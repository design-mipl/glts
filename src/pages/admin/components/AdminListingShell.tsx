import { Box, Stack } from '@mui/material'
import type { ReactNode } from 'react'
import { BaseCard, DataTable, Tabs } from '@/design-system/UIComponents'
import type { DataTableProps, TabItem } from '@/design-system/UIComponents'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import {
  ADMIN_RECORD_PAGE_TITLE_SX,
  ADMIN_RECORD_PAGE_TITLE_VARIANT,
} from './adminRecordPageTitle'
import { AdminPageHeader } from './AdminPageHeader'

export interface AdminListingTab {
  value: string
  label: string
  badge?: number | string
}

export interface AdminListingShellProps {
  title?: string
  description?: string
  eyebrow?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
  /** Sticky header replaces default AdminPageHeader when provided */
  stickyPageHeader?: ReactNode
  kpis?: ReactNode
  tabs?: AdminListingTab[]
  tabValue?: string
  onTabChange?: (value: string) => void
  toolbar?: ReactNode
  /** Full listing body (table/grid + optional pagination). Use instead of tableProps. */
  listingContent?: ReactNode
  tableProps?: DataTableProps
  children?: ReactNode
  footer?: ReactNode
}

export function AdminListingShell({
  title,
  description,
  eyebrow,
  breadcrumbs,
  actions,
  stickyPageHeader,
  kpis,
  tabs,
  tabValue,
  onTabChange,
  toolbar,
  listingContent,
  tableProps,
  children,
  footer,
}: AdminListingShellProps) {
  const showDefaultHeader = !stickyPageHeader && Boolean(title)

  const tabItems: TabItem[] | undefined = tabs?.map((tab) => ({
    value: tab.value,
    label: tab.label,
    badge: tab.badge,
  }))

  return (
    <Box>
      {stickyPageHeader}

      {showDefaultHeader && title ? (
        <AdminPageHeader
          title={title}
          titleVariant={ADMIN_RECORD_PAGE_TITLE_VARIANT}
          titleSx={ADMIN_RECORD_PAGE_TITLE_SX}
          description={description}
          eyebrow={eyebrow}
          breadcrumbs={breadcrumbs}
          actions={actions}
        />
      ) : null}

      <Stack spacing={2.5}>
        {kpis ? <Box>{kpis}</Box> : null}

        <BaseCard sx={{ overflow: 'hidden' }}>
          {tabs && tabs.length > 0 && tabValue != null && onTabChange && tabItems ? (
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
              <Tabs
                value={tabValue}
                onChange={onTabChange}
                variant="underline"
                size="sm"
                items={tabItems}
                sx={{ mb: 0, minHeight: 36 }}
              />
            </Box>
          ) : null}

          {toolbar ? (
            <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>{toolbar}</Box>
          ) : null}

          {listingContent ? (
            listingContent
          ) : tableProps ? (
            <DataTable {...tableProps} />
          ) : (
            <Box>{children}</Box>
          )}

          {footer ? (
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderTop: 1,
                borderColor: 'divider',
                overflow: 'visible',
                position: 'relative',
              }}
            >
              {footer}
            </Box>
          ) : null}
        </BaseCard>
      </Stack>
    </Box>
  )
}
