import { Archive, Copy, Settings } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type { BusinessSegment, CountryMaster } from '@/shared/types/countryMaster'
import {
  COUNTRY_STATUS_COLORS,
  COUNTRY_STATUS_LABELS,
} from '../config/countryProcessingConfig'
import { MasterAudienceTags } from '../../components/MasterAudienceTags'
import { toSegmentTagItems } from '../../config/masterAudienceTagConfig'
import { formatCountryDate } from '../utils/countryListingUtils'

interface ColumnHandlers {
  listingSegment?: BusinessSegment
  onConfigure: (row: CountryMaster) => void
  onDuplicate: (row: CountryMaster) => void
  onArchive: (row: CountryMaster) => void
}

export function buildCountryColumns({
  listingSegment,
  onConfigure,
  onDuplicate,
  onArchive,
}: ColumnHandlers): Column<CountryMaster>[] {
  const seg = listingSegment

  return [
    {
      key: 'name',
      label: 'Country Name',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      filterable: false,
      searchable: true,
      hideable: false,
      render: (_, row) => <span style={{ fontWeight: 600 }}>{row.name}</span>,
    },
    {
      key: 'code',
      label: 'Country Code',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      filterable: false,
      searchable: true,
      render: (_, row) => <span>{row.code}</span>,
    },
    {
      key: 'region',
      label: 'Region',
      widthSize: adminListingColumnWidthSize('country'),
      sortable: true,
      filterable: true,
      searchable: true,
      render: (_, row) => <span>{row.region}</span>,
    },
    {
      key: 'segments',
      label: 'Enabled Segments',
      widthSize: adminListingColumnWidthSize('description'),
      sortable: false,
      filterable: false,
      render: (_, row) => (
        <MasterAudienceTags
          items={toSegmentTagItems(countryMasterAdminService.getEnabledSegments(row))}
        />
      ),
    },
    {
      key: 'visaTypeCount',
      label: 'Total Visa Types',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      filterable: false,
      render: (_, row) => {
        const count = countryMasterAdminService.getAggregates(row, seg).visaTypeCount
        return <span>{count}</span>
      },
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      filterable: false,
      render: (_, row) => <span title={row.updatedAt}>{formatCountryDate(row.updatedAt)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: true,
      filterable: true,
      render: (_, row) => (
        <Badge
          label={COUNTRY_STATUS_LABELS[row.status]}
          color={COUNTRY_STATUS_COLORS[row.status]}
        />
      ),
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_, row) => {
        const actions: RowAction[] = [
          {
            label: 'View / Configure',
            icon: <Settings size={14} />,
            onClick: () => onConfigure(row),
          },
          {
            label: 'Duplicate',
            icon: <Copy size={14} />,
            onClick: () => onDuplicate(row),
          },
          {
            label: 'Archive',
            icon: <Archive size={14} />,
            onClick: () => onArchive(row),
            variant: 'destructive',
          },
        ]
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
