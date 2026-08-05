import { Eye, PencilLine, Power, PowerOff } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import type { Vendor } from '@/shared/types/vendor'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { paymentTermsLabel } from '../config/paymentTermsConfig'
import { vendorCategoryColor, vendorCategoryLabel } from '../config/vendorCategoryConfig'
import { vendorStatusColor, vendorStatusLabel, vendorTypeLabel } from '../config/vendorStatusConfig'

interface ColumnHandlers {
  onOpenDetail: (row: Vendor) => void
  onOpenEdit: (row: Vendor) => void
  onActivate: (row: Vendor) => void
  onDeactivate: (row: Vendor) => void
}

export function buildVendorColumns({
  onOpenDetail,
  onOpenEdit,
  onActivate,
  onDeactivate,
}: ColumnHandlers): Column<Vendor>[] {
  return [
    {
      key: 'vendorId',
      label: 'Vendor ID',
      widthSize: 'md',
      sortable: true,
      searchable: true,
      hideable: false,
    },
    {
      key: 'vendorName',
      label: 'Vendor Name',
      widthSize: 'lg',
      sortable: true,
      searchable: true,
    },
    {
      key: 'vendorCategory',
      label: 'Vendor Category',
      widthSize: 'md',
      filterable: true,
      render: (_, row) => (
        <Badge label={vendorCategoryLabel[row.vendorCategory]} color={vendorCategoryColor[row.vendorCategory]} size="sm" />
      ),
    },
    {
      key: 'vendorType',
      label: 'Vendor Type',
      widthSize: 'sm',
      filterable: true,
      render: (_, row) => vendorTypeLabel[row.vendorType],
    },
    {
      key: 'servicesCount',
      label: 'Services Count',
      widthSize: 'sm',
      sortable: true,
      render: (_, row) => row.serviceMappings.length,
    },
    {
      key: 'gstStatus',
      label: 'GST Status',
      widthSize: 'md',
      filterable: true,
      render: (_, row) => (
        <Badge
          label={row.gstApplicable ? 'GST Applicable' : 'No GST'}
          color={row.gstApplicable ? 'success' : 'neutral'}
          size="sm"
        />
      ),
    },
    {
      key: 'paymentTerms',
      label: 'Payment Terms',
      widthSize: 'md',
      filterable: true,
      render: (_, row) => paymentTermsLabel[row.commercial.paymentTerms],
    },
    {
      key: 'outstandingAmount',
      label: 'Outstanding Amount',
      widthSize: 'md',
      sortable: true,
      render: (_, row) => formatInr(row.outstandingAmount),
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'sm',
      filterable: true,
      render: (_, row) => (
        <Badge label={vendorStatusLabel[row.status]} color={vendorStatusColor[row.status]} size="sm" />
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      widthSize: 'md',
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
        const actions: RowAction[] = [
          { label: 'View vendor', icon: <Eye size={14} />, onClick: () => onOpenDetail(row) },
          { label: 'Edit vendor', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) },
        ]
        if (row.status === 'inactive') {
          actions.push({ label: 'Activate vendor', icon: <Power size={14} />, onClick: () => onActivate(row) })
        }
        if (row.status === 'active') {
          actions.push({ label: 'Deactivate vendor', icon: <PowerOff size={14} />, onClick: () => onDeactivate(row) })
        }
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
