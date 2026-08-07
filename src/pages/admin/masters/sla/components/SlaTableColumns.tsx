import { Typography } from '@mui/material'
import { Eye, PencilLine } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import {
  SLA_DOMAIN_LABELS,
  getSlaSubmoduleLabel,
  type SlaMaster,
} from '@/shared/types/slaMaster'
import { masterStatusColor, masterStatusLabel } from '../../config/masterStatusConfig'
import { formatMasterDate } from '../../utils/masterListingUtils'

interface ColumnHandlers {
  onOpenView: (row: SlaMaster) => void
  onOpenEdit: (row: SlaMaster) => void
}

export function buildSlaColumns({ onOpenView, onOpenEdit }: ColumnHandlers): Column<SlaMaster>[] {
  return [
    {
      key: 'name',
      label: 'SLA Name',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      filterable: false,
      searchable: true,
    },
    {
      key: 'domain',
      label: 'Module',
      widthSize: adminListingColumnWidthSize('description'),
      sortable: true,
      filterable: true,
      render: (_, row) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {SLA_DOMAIN_LABELS[row.domain]}
        </Typography>
      ),
    },
    {
      key: 'segment',
      label: 'Submodule',
      widthSize: adminListingColumnWidthSize('description'),
      sortable: true,
      filterable: true,
      render: (_, row) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {getSlaSubmoduleLabel(row.domain, row.segment)}
        </Typography>
      ),
    },
    {
      key: 'singleE2e',
      label: 'Single hours',
      widthSize: adminListingColumnWidthSize('sla'),
      sortable: false,
      filterable: false,
      render: (_, row) => (
        <Typography variant="body2" sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
          {row.single.e2eHours}h
        </Typography>
      ),
    },
    {
      key: 'bulkE2e',
      label: 'Bulk hours',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: false,
      filterable: false,
      render: (_, row) => (
        <Typography variant="body2" sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
          {row.bulkBands['0_10'].e2eHours}/{row.bulkBands['11_20'].e2eHours}/
          {row.bulkBands['21_plus'].e2eHours}h
        </Typography>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: false,
      filterable: true,
      render: (_, row) => (
        <Badge
          label={masterStatusLabel[row.status]}
          color={masterStatusColor[row.status]}
          size="sm"
        />
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      filterable: false,
      render: (_, row) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {formatMasterDate(row.updatedAt)}
        </Typography>
      ),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      align: 'center',
      render: (_, row) => {
        const actions: RowAction[] = [
          { label: 'View', icon: <Eye size={14} />, onClick: () => onOpenView(row) },
          { label: 'Edit', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) },
        ]
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
