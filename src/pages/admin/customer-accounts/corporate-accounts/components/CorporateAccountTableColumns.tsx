import { Eye, PencilLine, Power, PowerOff } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { corporateAccountService } from '@/shared/services/corporateAccountService'
import type { CorporateAccount } from '@/shared/types/corporateAccount'
import { corporatePortalStatusColor, corporatePortalStatusLabel } from '../config/corporateAccountStatusConfig'

interface ColumnHandlers {
  onOpenDetail: (row: CorporateAccount) => void
  onOpenEdit: (row: CorporateAccount) => void
  onActivate: (row: CorporateAccount) => void
  onDeactivate: (row: CorporateAccount) => void
}

export function buildCorporateAccountColumns({
  onOpenDetail,
  onOpenEdit,
  onActivate,
  onDeactivate,
}: ColumnHandlers): Column<CorporateAccount>[] {
  return [
    { key: 'companyId', label: 'Company ID', sortable: true, searchable: true, hideable: false, minWidth: 110 },
    { key: 'companyName', label: 'Company Name', sortable: true, searchable: true, minWidth: 200 },
    { key: 'workflowType', label: 'Workflow Type', filterable: true, minWidth: 120 },
    { key: 'superAdmin', label: 'Super Admin', minWidth: 150, searchable: true },
    { key: 'totalAdmins', label: 'Total Admins', sortable: true, minWidth: 100, align: 'center' },
    { key: 'totalEntities', label: 'Total Entities', sortable: true, minWidth: 110, align: 'center' },
    { key: 'totalVessels', label: 'Total Vessels', sortable: true, minWidth: 110, align: 'center' },
    {
      key: 'portalStatus',
      label: 'Portal Status',
      filterable: true,
      render: (_, row) => (
        <Badge label={corporatePortalStatusLabel[row.portalStatus]} color={corporatePortalStatusColor[row.portalStatus]} size="sm" />
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      sortable: true,
      minWidth: 120,
      render: (_, row) => new Date(row.updatedAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      align: 'center',
      width: 56,
      render: (_, row) => {
        const counts = corporateAccountService.getCounts(row)
        const actions: RowAction[] = [
          { label: 'View', icon: <Eye size={14} />, onClick: () => onOpenDetail(row) },
        ]
        if (row.portalStatus === 'draft') {
          actions.push({ label: 'Edit', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) })
        }
        if (row.portalStatus !== 'active' && counts.totalAdmins > 0) {
          actions.push({ label: 'Activate', icon: <Power size={14} />, onClick: () => onActivate(row) })
        }
        if (row.portalStatus === 'active') {
          actions.push({ label: 'Deactivate', icon: <PowerOff size={14} />, onClick: () => onDeactivate(row) })
        }
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
