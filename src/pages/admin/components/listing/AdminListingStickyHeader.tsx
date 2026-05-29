import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import {
  ADMIN_RECORD_PAGE_TITLE_SX,
  ADMIN_RECORD_PAGE_TITLE_VARIANT,
} from '../adminRecordPageTitle'
import { AdminPageHeader, type AdminPageHeaderProps } from '../AdminPageHeader'

type AdminListingStickyHeaderProps = AdminPageHeaderProps

export function AdminListingStickyHeader({
  titleVariant = ADMIN_RECORD_PAGE_TITLE_VARIANT,
  titleSx,
  ...props
}: AdminListingStickyHeaderProps) {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: 'background.default',
        pb: 1.25,
        mb: 0,
      }}
    >
      <AdminPageHeader
        titleVariant={titleVariant}
        titleSx={{ ...ADMIN_RECORD_PAGE_TITLE_SX, ...titleSx }}
        {...props}
      />
    </Box>
  )
}

export function AdminListingStickyHeaderSlot({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: 'background.default',
        pb: 1.25,
      }}
    >
      {children}
    </Box>
  )
}
