import { SEGMENT_LABELS } from '@/shared/data/countryMasterDefaults'
import type {
  BusinessSegment,
  CountryConfigSummary,
  CountryConfigValidationWarning,
  CountryMaster,
} from '@/shared/types/countryMaster'

export function getCountryConfigSummary(country: CountryMaster): CountryConfigSummary {
  const warnings = getCountryConfigWarnings(country)
  let totalVisaTypes = 0
  let totalJurisdictions = 0
  let totalDocuments = 0
  let totalSegments = 0

  for (const seg of country.segments) {
    if (!seg.enabled) continue
    totalSegments += 1
    totalDocuments += seg.commonDocuments?.length ?? 0
    totalVisaTypes += seg.visaTypes.length
    for (const vt of seg.visaTypes) {
      totalJurisdictions += vt.jurisdictions?.length ?? 0
      for (const jur of vt.jurisdictions ?? []) {
        totalDocuments += jur.documents?.length ?? 0
      }
      totalDocuments += vt.applicationDocuments?.length ?? 0
    }
  }

  return {
    totalSegments,
    totalVisaTypes,
    totalJurisdictions,
    totalDocuments,
    warnings,
  }
}

export function getCountryConfigWarnings(country: CountryMaster): CountryConfigValidationWarning[] {
  const warnings: CountryConfigValidationWarning[] = []

  if (country.status === 'draft') {
    warnings.push({
      id: 'country-draft',
      message: 'Country is saved as draft and not yet published.',
      nodePath: 'overview',
      severity: 'warning',
    })
  }

  for (const seg of country.segments) {
    const segLabel = SEGMENT_LABELS[seg.segment]

    if (seg.enabled && seg.visaTypes.length === 0) {
      warnings.push({
        id: `seg-empty-${seg.segment}`,
        message: `${segLabel} enabled but no visa type configured`,
        nodePath: seg.segment,
        severity: 'warning',
      })
    }

    for (const vt of seg.visaTypes) {
      const vtPath = `${seg.segment}/${vt.id}`

      if (seg.enabled && (vt.jurisdictions?.length ?? 0) === 0) {
        warnings.push({
          id: `vt-no-jur-${vt.id}`,
          message: `${segLabel} > ${vt.name} has no jurisdictions configured`,
          nodePath: vtPath,
          severity: 'warning',
        })
      }

      for (const jur of vt.jurisdictions ?? []) {
        const jurPath = `${vtPath}/${jur.id}`
        const mandatoryDocs = jur.documents?.filter((d) => d.mandatory) ?? []
        if (mandatoryDocs.length === 0 && seg.enabled) {
          warnings.push({
            id: `jur-no-docs-${jur.id}`,
            message: `${segLabel} > ${vt.name} > ${jur.name} missing mandatory documents`,
            nodePath: jurPath,
            severity: 'error',
          })
        }
      }
    }
  }

  return warnings
}

export function formatConfigNodePath(country: CountryMaster, nodePath: string): string {
  if (nodePath === 'overview') return country.name
  if (nodePath === 'review') return `${country.name} > Review & Publish`

  const parts = nodePath.split('/')
  const labels: string[] = [country.name]

  if (parts[0] && parts[0] in SEGMENT_LABELS) {
    labels.push(SEGMENT_LABELS[parts[0] as BusinessSegment])
  }
  if (parts[1]) {
    const seg = country.segments.find((s) => s.segment === parts[0])
    const vt = seg?.visaTypes.find((v) => v.id === parts[1])
    labels.push(vt?.name ?? parts[1])
  }
  if (parts[2]) {
    const seg = country.segments.find((s) => s.segment === parts[0])
    const vt = seg?.visaTypes.find((v) => v.id === parts[1])
    const jur = vt?.jurisdictions?.find((j) => j.id === parts[2])
    labels.push(jur?.name ?? parts[2])
  }

  return labels.join(' > ')
}
