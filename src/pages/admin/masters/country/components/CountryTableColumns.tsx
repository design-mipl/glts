import { Archive, Copy, Settings } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
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
      sortable: true,
      searchable: true,
      hideable: false,
      minWidth: 160,
      render: (_, row) => <span style={{ fontWeight: 600 }}>{row.name}</span>,
    },
    {
      key: 'code',
      label: 'Country Code',
      sortable: true,
      searchable: true,
      minWidth: 110,
      render: (_, row) => <span>{row.code}</span>,
    },
    {
      key: 'region',
      label: 'Region',
      sortable: true,
      searchable: true,
      minWidth: 120,
      render: (_, row) => <span>{row.region}</span>,
    },
    {
      key: 'segments',
      label: 'Enabled Segments',
      sortable: false,
      minWidth: 200,
      render: (_, row) => (
        <MasterAudienceTags
          items={toSegmentTagItems(countryMasterAdminService.getEnabledSegments(row))}
        />
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
      key: 'updatedAt',
      label: 'Last Updated',
      sortable: true,
      minWidth: 120,
      render: (_, row) => <span title={row.updatedAt}>{formatCountryDate(row.updatedAt)}</span>,
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
        return <RowActions actions={actions} row={row} />
      },
    },
  ]
}
