import type { CustomerListingGridItem } from '@/pages/customer/features/shared/components/listing/CustomerListingGrid'
import {
  formatBulkApplicantListingLabel,
  type BulkBatchRow,
  type SingleApplicationRow,
} from '../data/applicationFlowData'
import { getApplicationOperationalTone, getApplicationTypeLabel } from '../components/listing/applicationStatus'
import {
  resolveApplicationCompanyName,
  resolveApplicationTravelerRole,
  resolveApplicationVesselName,
} from './applicationCompanyUtils'
import { resolveApplicationCreatorLabel } from './applicationCreatorUtils'
import type { ApplicationListingRow } from '../types/applicationListing.types'
import { isBulkRow } from '../types/applicationListing.types'
import {
  showsMarineReferenceFields,
  showsTravelerRoleColumn,
  usesDesignationLabel,
} from '@/shared/utils/applicationSegmentListingPolicy'

function toneToGridColor(tone: ReturnType<typeof getApplicationOperationalTone>): CustomerListingGridItem['statusColor'] {
  if (tone === 'success') return 'success'
  if (tone === 'warning') return 'warning'
  if (tone === 'info') return 'info'
  return 'default'
}

function buildRoleMeta(row: ApplicationListingRow): string {
  if (!showsTravelerRoleColumn(row.customerSegment)) return ''
  const role = resolveApplicationTravelerRole(row)
  return role && role !== '—' ? `${role} · ` : ''
}

function buildMarineMeta(row: ApplicationListingRow): string {
  if (!showsMarineReferenceFields(row.customerSegment)) return ''
  const vessel = resolveApplicationVesselName(row)
  return vessel && vessel !== '—' ? `${vessel} · ` : ''
}

function buildCompanyMeta(row: ApplicationListingRow): string {
  if (!usesDesignationLabel(row.customerSegment)) return ''
  const company = resolveApplicationCompanyName(row)
  return company && company !== '—' ? `${company} · ` : ''
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
    meta: `${buildRoleMeta(row)}${buildCompanyMeta(row)}${buildMarineMeta(row)}${row.countryFlag ?? ''} ${row.country} · ${row.visaType}${row.jurisdiction ? ` · ${row.jurisdiction}` : ''} · Created by ${resolveApplicationCreatorLabel(row.createdByEmail)}`,
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
    meta: `${buildRoleMeta(row)}${buildMarineMeta(row)}${row.countryFlag ?? ''} ${row.country} · ${row.visaType}${row.jurisdiction ? ` · ${row.jurisdiction}` : ''} · ${formatBulkApplicantListingLabel(row)} · Created by ${resolveApplicationCreatorLabel(row.createdByEmail)}`,
    status: row.operationalStatus,
    statusColor: toneToGridColor(tone),
  }
}
