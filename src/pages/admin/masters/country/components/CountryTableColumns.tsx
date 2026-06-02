import {
  Eye,
  FileCheck,
  Layers,
  PencilLine,
  Power,
  PowerOff,
} from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions, Tag } from '@/design-system/UIComponents'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type { BusinessSegment, CountryMaster } from '@/shared/types/countryMaster'
import {
  COUNTRY_STATUS_COLORS,
  COUNTRY_STATUS_LABELS,
  PROCESSING_TYPE_LABELS,
} from '../config/countryProcessingConfig'
import { SEGMENT_LABELS } from '../config/countrySegmentConfig'
import { formatCountryDate } from '../utils/countryListingUtils'
import { CountryFlagVisual } from '@/shared/components/CountryFlagVisual'

interface ColumnHandlers {
  listingSegment?: BusinessSegment
  onOpenDetail: (row: CountryMaster, segment?: BusinessSegment) => void
  onOpenEdit: (row: CountryMaster) => void
  onToggleStatus: (row: CountryMaster) => void
  onConfigureVisaTypes: (row: CountryMaster, segment?: BusinessSegment) => void
  onConfigureChecklist: (row: CountryMaster, segment?: BusinessSegment) => void
}

export function buildCountryColumns({
  listingSegment,
  onOpenDetail,
  onOpenEdit,
  onToggleStatus,
  onConfigureVisaTypes,
  onConfigureChecklist,
}: ColumnHandlers): Column<CountryMaster>[] {
  const seg = listingSegment

  return [
    {
      key: 'flag',
      label: '',
      width: 56,
      sortable: false,
      searchable: false,
      hideable: false,
      render: (_, row) => <CountryFlagVisual flag={row.flag} size={22} />,
    },
    {
      key: 'name',
      label: 'Country Name',
      sortable: true,
      searchable: true,
      hideable: false,
      minWidth: 180,
      render: (_, row) => (
        <span>
          <span style={{ fontWeight: 600 }}>{row.name}</span>
          <span style={{ display: 'block', fontSize: 12, color: 'var(--mui-palette-text-secondary)' }}>
            {row.code}
          </span>
        </span>
      ),
    },
    {
      key: 'segments',
      label: 'Enabled Segments',
      sortable: false,
      minWidth: 200,
      render: (_, row) => (
        <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {countryMasterAdminService.getEnabledSegments(row).map((s) => (
            <Tag key={s} label={SEGMENT_LABELS[s]} size="sm" />
          ))}
        </span>
      ),
    },
    {
      key: 'visaTypeCount',
      label: 'Total Visa Types',
      sortable: true,
      minWidth: 120,
      render: (_, row) => {
        const count = countryMasterAdminService.getAggregates(row, seg).visaTypeCount
        return <span>{count}</span>
      },
    },
    {
      key: 'checklistCount',
      label: 'Total Document Checklists',
      sortable: true,
      minWidth: 140,
      render: (_, row) => {
        const count = countryMasterAdminService.getAggregates(row, seg).checklistCount
        return <span>{count}</span>
      },
    },
    {
      key: 'processingType',
      label: 'Processing Type',
      sortable: true,
      minWidth: 130,
      render: (_, row) => (
        <Badge label={PROCESSING_TYPE_LABELS[row.processingType]} color="info" />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      minWidth: 100,
      render: (_, row) => (
        <Badge
          label={COUNTRY_STATUS_LABELS[row.status]}
          color={COUNTRY_STATUS_COLORS[row.status]}
        />
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      sortable: true,
      minWidth: 120,
      render: (_, row) => <span title={row.updatedAt}>{formatCountryDate(row.updatedAt)}</span>,
    },
    {
      key: 'actions',
      label: '',
      width: 56,
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_, row) => {
        const actions: RowAction[] = [
          {
            label: 'View detail',
            icon: <Eye size={14} />,
            onClick: () => onOpenDetail(row, seg),
          },
          {
            label: 'Edit',
            icon: <PencilLine size={14} />,
            onClick: () => onOpenEdit(row),
          },
          {
            label: row.status === 'active' ? 'Deactivate' : 'Activate',
            icon: row.status === 'active' ? <PowerOff size={14} /> : <Power size={14} />,
            onClick: () => onToggleStatus(row),
            variant: row.status === 'active' ? 'destructive' : undefined,
          },
          {
            label: 'Configure visa types',
            icon: <Layers size={14} />,
            onClick: () => onConfigureVisaTypes(row, seg),
          },
          {
            label: 'Configure checklist',
            icon: <FileCheck size={14} />,
            onClick: () => onConfigureChecklist(row, seg),
          },
        ]
        return <RowActions actions={actions} row={row} />
      },
    },
  ]
}
