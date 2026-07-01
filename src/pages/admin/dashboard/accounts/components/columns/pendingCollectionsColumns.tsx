import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { PendingCollectionRow } from '../../data/accountsDashboardMock'
import { ageingBucketColor, collectionStatusColor } from '../../utils/applyAccountsDashboardFilters'

function OverdueAccentCell({ children, isOverdue }: { children: ReactNode; isOverdue: boolean }) {
  const theme = useTheme()
  if (!isOverdue) return <>{children}</>
  return (
    <Box sx={{ borderLeft: 3, borderColor: theme.palette.error.main, pl: 1, ml: -1 }}>
      {children}
    </Box>
  )
}

export interface PendingCollectionsColumnHandlers {
  onView: (row: PendingCollectionRow) => void
  onFollowUp: (row: PendingCollectionRow) => void
}

export function buildPendingCollectionsColumns({
  onView,
  onFollowUp,
}: PendingCollectionsColumnHandlers): Column<PendingCollectionRow>[] {
  return [
    {
      key: 'invoiceNumber',
      label: 'Invoice Number',
      widthSize: adminListingColumnWidthSize('code'),
      hideable: false,
      render: (_, row) => (
        <OverdueAccentCell isOverdue={row.isOverdue}>{row.invoiceNumber}</OverdueAccentCell>
      ),
    },
    { key: 'company', label: 'Company', widthSize: adminListingColumnWidthSize('company') },
    { key: 'customer', label: 'Customer', widthSize: adminListingColumnWidthSize('name') },
    { key: 'invoiceDate', label: 'Invoice Date', widthSize: adminListingColumnWidthSize('date') },
    { key: 'dueDate', label: 'Due Date', widthSize: adminListingColumnWidthSize('date') },
    { key: 'outstandingAmount', label: 'Outstanding Amount', widthSize: adminListingColumnWidthSize('code') },
    {
      key: 'ageingBucket',
      label: 'Ageing Bucket',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_, row) => (
        <Badge label={row.ageingBucket} color={ageingBucketColor(row.ageingBucket)} size="sm" />
      ),
    },
    { key: 'followUpDate', label: 'Follow-up Date', widthSize: adminListingColumnWidthSize('date') },
    { key: 'assignedExecutive', label: 'Assigned Executive', widthSize: adminListingColumnWidthSize('assignee') },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_, row) => (
        <Badge label={row.status} color={collectionStatusColor(row.status)} size="sm" />
      ),
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      align: 'center',
      width: 56,
      render: (_, row) => (
        <RowActions
          row={row}
          actions={[
            { label: 'Open invoice', onClick: () => onView(row) },
            { label: 'Record follow-up', onClick: () => onFollowUp(row) },
          ]}
        />
      ),
    },
  ]
}
