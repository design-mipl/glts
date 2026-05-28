import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { AdminPageHeader, type AdminPageHeaderProps } from '../AdminPageHeader'

type AdminListingStickyHeaderProps = AdminPageHeaderProps

export function AdminListingStickyHeader(props: AdminListingStickyHeaderProps) {
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
      <AdminPageHeader {...props} />
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
