import type { CustomerListingGridItem } from '@/pages/customer/features/shared/components/listing/CustomerListingGrid'
import type { BulkBatchRow, SingleApplicationRow } from '../data/applicationFlowData'
import { getApplicationOperationalTone, getApplicationTypeLabel } from '../components/listing/applicationStatus'
import { resolveApplicationCreatorLabel } from './applicationCreatorUtils'
import type { ApplicationListingRow } from '../types/applicationListing.types'
import { isBulkRow } from '../types/applicationListing.types'

function toneToGridColor(tone: ReturnType<typeof getApplicationOperationalTone>): CustomerListingGridItem['statusColor'] {
  if (tone === 'success') return 'success'
  if (tone === 'warning') return 'warning'
  if (tone === 'info') return 'info'
  return 'default'
}

export function mapApplicationRowsToGridItems(rows: ApplicationListingRow[]): CustomerListingGridItem[] {
  return rows.map(row => {
    if (isBulkRow(row)) {
      return mapBulkRowToGridItem(row)
    }
    return mapSingleRowToGridItem(row)
  })
}

function mapSingleRowToGridItem(row: SingleApplicationRow): CustomerListingGridItem {
  const tone = getApplicationOperationalTone(row.operationalStatus)
  const typeLabel = getApplicationTypeLabel(row.recordType)
  return {
    id: row.id,
    title: row.applicantName,
    subtitle: `${typeLabel} · ${row.id}`,
    meta: `${row.countryFlag ?? ''} ${row.country} · ${row.visaType} · Created by ${resolveApplicationCreatorLabel(row.createdByEmail)}`,
    status: row.operationalStatus,
    statusColor: toneToGridColor(tone),
  }
}

function mapBulkRowToGridItem(row: BulkBatchRow): CustomerListingGridItem {
  const tone = getApplicationOperationalTone(row.operationalStatus)
  const typeLabel = getApplicationTypeLabel(row.recordType)
  return {
    id: row.id,
    title: row.companyName,
    subtitle: `${typeLabel} · ${row.id}`,
    meta: `${row.countryFlag ?? ''} ${row.country} · ${row.totalApplicants} travelers · Created by ${resolveApplicationCreatorLabel(row.createdByEmail)}`,
    status: row.operationalStatus,
    statusColor: toneToGridColor(tone),
  }
}
