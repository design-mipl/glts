import { Eye, PencilLine, Power, PowerOff } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import { corporateAccountService } from '@/shared/services/corporateAccountService'
import type { CorporateAccount } from '@/shared/types/corporateAccount'
import { workflowTypeColor, workflowTypeLabel } from '../../agreements/config/agreementStatusConfig'
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
  const getWorkflowBadge = (workflowType: string) => {
    const workflowKey = workflowType as keyof typeof workflowTypeLabel
    return <Badge label={workflowTypeLabel[workflowKey]} color={workflowTypeColor[workflowKey]} size="sm" />
  }

  return [
    {
      key: 'companyId',
      label: 'Company ID',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
      hideable: false,
    },
    {
      key: 'companyName',
      label: 'Company Name',
      widthSize: adminListingColumnWidthSize('company'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'workflowType',
      label: 'Workflow Type',
      widthSize: adminListingColumnWidthSize('service'),
      filterable: true,
      render: (_, row) => getWorkflowBadge(row.workflowType),
    },
    {
      key: 'superAdmin',
      label: 'Super Admin',
      widthSize: adminListingColumnWidthSize('assignee'),
      searchable: true,
    },
    {
      key: 'totalAdmins',
      label: 'Total Admins',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      align: 'center',
    },
    {
      key: 'totalEntities',
      label: 'Total Entities',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      align: 'center',
    },
    {
      key: 'totalVessels',
      label: 'Total Vessels',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      align: 'center',
    },
    {
      key: 'portalStatus',
      label: 'Portal Status',
      widthSize: adminListingColumnWidthSize('status'),
      filterable: true,
      render: (_, row) => (
        <Badge label={corporatePortalStatusLabel[row.portalStatus]} color={corporatePortalStatusColor[row.portalStatus]} size="sm" />
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
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
