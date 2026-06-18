import { Eye, FileText, PencilLine, Share2, ShieldCheck } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { QuotationRecord } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { getCurrentVersion } from '@/shared/utils/quotationValidation'
import {
  quotationSharedStatusColor,
  quotationSharedStatusLabel,
  quotationSourceTypeColor,
  quotationSourceTypeLabel,
  quotationVersionStatusColor,
  quotationVersionStatusLabel,
  workflowTypeColor,
  workflowTypeLabel,
} from '../config/quotationStatusConfig'

interface ColumnHandlers {
  onOpenDetail: (row: QuotationRecord) => void
  onOpenEdit: (row: QuotationRecord) => void
  onShare: (row: QuotationRecord) => void
  onGeneratePdf: (row: QuotationRecord) => void
  onConvert: (row: QuotationRecord) => void
}

export function buildQuotationColumns({
  onOpenDetail,
  onOpenEdit,
  onShare,
  onGeneratePdf,
  onConvert,
}: ColumnHandlers): Column<QuotationRecord>[] {
  return [
    {
      key: 'quotationNo',
      label: 'Quotation No.',
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
      key: 'sourceType',
      label: 'Type',
      widthSize: adminListingColumnWidthSize('status'),
      filterable: true,
      render: (_, row) => (
        <Badge
          label={quotationSourceTypeLabel[row.sourceType]}
          color={quotationSourceTypeColor[row.sourceType]}
          size="sm"
        />
      ),
    },
    {
      key: 'workflowType',
      label: 'Workflow Type',
      widthSize: adminListingColumnWidthSize('service'),
      filterable: true,
      render: (_, row) => (
        <Badge label={workflowTypeLabel[row.workflowType]} color={workflowTypeColor[row.workflowType]} size="sm" />
      ),
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      widthSize: 'md',
      sortable: true,
      render: (_, row) => {
        const version = getCurrentVersion(row)
        return version ? formatInr(version.totals.grandTotal) : '—'
      },
    },
    {
      key: 'currentVersion',
      label: 'Current Version',
      widthSize: adminListingColumnWidthSize('count'),
      render: (_, row) => getCurrentVersion(row)?.versionLabel ?? '—',
    },
    {
      key: 'approvalStatus',
      label: 'Approval Status',
      widthSize: adminListingColumnWidthSize('status'),
      filterable: true,
      render: (_, row) => {
        const version = getCurrentVersion(row)
        if (!version) return '—'
        return (
          <Badge
            label={quotationVersionStatusLabel[version.status]}
            color={quotationVersionStatusColor[version.status]}
            size="sm"
          />
        )
      },
    },
    {
      key: 'sharedStatus',
      label: 'Shared Status',
      widthSize: adminListingColumnWidthSize('status'),
      filterable: true,
      render: (_, row) => (
        <Badge
          label={quotationSharedStatusLabel[row.sharedStatus]}
          color={quotationSharedStatusColor[row.sharedStatus]}
          size="sm"
        />
      ),
    },
    {
      key: 'validTill',
      label: 'Valid Till',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_, row) => {
        const version = getCurrentVersion(row)
        const actions: RowAction[] = [
          { label: 'View', icon: <Eye size={14} />, onClick: () => onOpenDetail(row) },
        ]
        if (version?.status === 'draft') {
          actions.push({ label: 'Edit', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) })
        }
        if (version?.status === 'approved' && row.sharedStatus === 'not_shared') {
          actions.push({ label: 'Share', icon: <Share2 size={14} />, onClick: () => onShare(row) })
        }
        actions.push({ label: 'Generate PDF', icon: <FileText size={14} />, onClick: () => onGeneratePdf(row) })
        if (version?.status === 'approved' && !row.convertedAgreementId) {
          actions.push({
            label: 'Convert to Agreement',
            icon: <ShieldCheck size={14} />,
            onClick: () => onConvert(row),
          })
        }
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
