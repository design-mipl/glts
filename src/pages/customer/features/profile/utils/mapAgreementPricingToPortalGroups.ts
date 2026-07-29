import { formatInr } from '@/shared/utils/invoiceCalculations'
import type { AgreementMiscCostRow, AgreementPricingRow } from '@/shared/types/commercialAgreement'
import type { AgreementBillingType } from '@/shared/types/commercialAgreement'
import type { PricingGroup, PricingModel, PricingRow } from '../types/accountWorkspace'

const SKIP_COUNTRY = new Set(['all', '—', '-'])

function toPricingModel(billingType: AgreementBillingType): PricingModel {
  if (billingType === 'credit' || billingType === 'advance' || billingType === 'mixed') {
    return billingType
  }
  return 'credit'
}

function formatFee(amount: number): string {
  return formatInr(amount).replace('₹', 'INR ')
}

function buildAddon(row: AgreementPricingRow): string | undefined {
  const parts: string[] = []
  if (row.gstApplicable) parts.push('GST applicable')
  if (row.remarks?.trim()) parts.push(row.remarks.trim())
  return parts.length > 0 ? parts.join(' · ') : undefined
}

/** Maps commercial-agreement / quotation pricing matrix rows into portal pricing groups. */
export function mapAgreementPricingToPortalGroups(
  pricingMatrix: AgreementPricingRow[],
  billingType: AgreementBillingType,
  miscellaneousCosts: AgreementMiscCostRow[] = [],
): PricingGroup[] {
  const pricingModel = toPricingModel(billingType)
  const byCountry = new Map<string, PricingRow[]>()

  for (const row of pricingMatrix) {
    const country = row.country?.trim() || 'Other'
    if (SKIP_COUNTRY.has(country.toLowerCase())) continue

    const portalRow: PricingRow = {
      id: row.id,
      country,
      visaType: row.visaType || '—',
      serviceType: row.servicePresetName || 'Service fee',
      baseFee: formatFee(row.serviceFee),
      additionalCharges: buildAddon(row),
      pricingModel,
    }

    const list = byCountry.get(country) ?? []
    list.push(portalRow)
    byCountry.set(country, list)
  }

  const groups: PricingGroup[] = [...byCountry.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([country, rows]) => ({
      id: `pg-${country.toLowerCase().replace(/\s+/g, '-')}`,
      title: country,
      rows,
    }))

  if (miscellaneousCosts.length > 0) {
    groups.push({
      id: 'pg-miscellaneous',
      title: 'Additional services',
      rows: miscellaneousCosts.map(cost => ({
        id: cost.id,
        country: 'Additional services',
        visaType: '—',
        serviceType: cost.serviceName,
        baseFee: formatFee(cost.amount),
        additionalCharges: [
          cost.pricingType !== 'fixed' ? cost.pricingType : null,
          cost.gstApplicable ? 'GST applicable' : null,
          cost.remarks?.trim() || null,
        ]
          .filter(Boolean)
          .join(' · ') || undefined,
        pricingModel,
      })),
    })
  }

  return groups
}
