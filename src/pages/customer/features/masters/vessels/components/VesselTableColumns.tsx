import { Eye, PencilLine, Power, PowerOff, Trash2 } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { RowActions } from '@/design-system/UIComponents'
import type { VesselMaster } from '@/shared/types/vesselMaster'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { vesselStatusLabel, vesselStatusTone, vesselTypeLabel } from '../config/vesselTypeConfig'
import { formatVesselDate } from '../utils/vesselListingUtils'

interface ColumnHandlers {
  onOpenDetail: (row: VesselMaster) => void
  onOpenEdit: (row: VesselMaster) => void
  onToggleStatus: (row: VesselMaster) => void
  onDelete: (row: VesselMaster) => void
}

export function buildVesselColumns({
  onOpenDetail,
  onOpenEdit,
  onToggleStatus,
  onDelete,
}: ColumnHandlers): Column<VesselMaster>[] {
  return [
    { key: 'vesselName', label: 'Vessel name', sortable: true, searchable: true, hideable: false, minWidth: 160 },
    { key: 'imoNumber', label: 'IMO number', sortable: true, searchable: true, minWidth: 110 },
    {
      key: 'vesselType',
      label: 'Vessel type',
      sortable: true,
      minWidth: 120,
      render: (_, row) => vesselTypeLabel[row.vesselType],
    },
    {
      key: 'flagCountry',
      label: 'Flag / registered country',
      sortable: true,
      filterable: true,
      minWidth: 160,
    },
    { key: 'portOfRegistry', label: 'Port of registry', sortable: true, minWidth: 130 },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      minWidth: 100,
      render: (_, row) => (
        <CustomerStatusChip label={vesselStatusLabel[row.status]} tone={vesselStatusTone[row.status]} />
      ),
    },
    {
      key: 'lastUpdated',
      label: 'Last updated',
      sortable: true,
      minWidth: 120,
      render: (_, row) => formatVesselDate(row.updatedAt),
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      width: 56,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_, row) => {
        const actions: RowAction[] = [
          { label: 'View', icon: <Eye size={16} />, onClick: () => onOpenDetail(row) },
          { label: 'Edit', icon: <PencilLine size={16} />, onClick: () => onOpenEdit(row) },
          {
            label: row.status === 'active' ? 'Inactivate' : 'Activate',
            icon: row.status === 'active' ? <PowerOff size={16} /> : <Power size={16} />,
            onClick: () => onToggleStatus(row),
          },
          { label: 'Delete / archive', icon: <Trash2 size={16} />, onClick: () => onDelete(row), variant: 'destructive' },
        ]
        return <RowActions actions={actions} row={row} />
      },
    },
  ]
}
