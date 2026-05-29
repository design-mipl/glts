import { Eye, PencilLine, ShieldCheck, XCircle } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import {
  agreementStatusColor,
  agreementStatusLabel,
  agreementTypeLabel,
  billingTypeLabel,
  workflowTypeLabel,
} from '../config/agreementStatusConfig'

interface ColumnHandlers {
  onOpenDetail: (row: CommercialAgreement) => void
  onOpenEdit: (row: CommercialAgreement) => void
  onApprove: (row: CommercialAgreement) => void
  onReject: (row: CommercialAgreement) => void
}

export function buildAgreementColumns({
  onOpenDetail,
  onOpenEdit,
  onApprove,
  onReject,
}: ColumnHandlers): Column<CommercialAgreement>[] {
  return [
    { key: 'agreementId', label: 'Agreement ID', sortable: true, searchable: true, hideable: false, minWidth: 130 },
    { key: 'companyName', label: 'Company Name', sortable: true, searchable: true, minWidth: 200 },
    {
      key: 'agreementType',
      label: 'Agreement Type',
      filterable: true,
      minWidth: 140,
      render: (_, row) => agreementTypeLabel[row.agreementType],
    },
    {
      key: 'workflowType',
      label: 'Workflow Type',
      filterable: true,
      minWidth: 120,
      render: (_, row) => workflowTypeLabel[row.workflowType],
    },
    {
      key: 'billingType',
      label: 'Billing Type',
      filterable: true,
      minWidth: 110,
      render: (_, row) => billingTypeLabel[row.billingType],
    },
    { key: 'startDate', label: 'Start Date', sortable: true, minWidth: 110 },
    { key: 'endDate', label: 'End Date', sortable: true, minWidth: 110 },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      render: (_, row) => (
        <Badge label={agreementStatusLabel[row.status]} color={agreementStatusColor[row.status]} size="sm" />
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
        const actions: RowAction[] = [
          { label: 'View', icon: <Eye size={14} />, onClick: () => onOpenDetail(row) },
        ]
        if (row.status === 'draft' || row.status === 'submitted') {
          actions.push({ label: 'Edit', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) })
        }
        if (row.status === 'submitted') {
          actions.push({ label: 'Approve', icon: <ShieldCheck size={14} />, onClick: () => onApprove(row) })
          actions.push({
            label: 'Reject',
            icon: <XCircle size={14} />,
            onClick: () => onReject(row),
          })
        }
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
