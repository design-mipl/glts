import type { CountryVisaJurisdiction, CountryVisaType } from '@/shared/types/countryMaster'
import { parseProcessingWorkingDays } from '@/shared/utils/travelDateFeasibility'

function parseProcessingDaysRange(value: string): { min: number; max: number } | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const nums = [...trimmed.matchAll(/\d+/g)].map((m) => Number(m[0]))
  if (nums.length === 0) return null
  return { min: Math.min(...nums), max: Math.max(...nums) }
}

function pickDisplayName(jurisdiction: CountryVisaJurisdiction): string {
  return jurisdiction.submissionCenter || jurisdiction.name || '—'
}

export interface VisaTypeProcessingTimelineResolution {
  /** Display string, e.g. "7-12 business days" (uses "-" to match existing ETA parsing patterns). */
  timeline: string
  lowerDays: number | null
  highestDays: number | null
  lowestFromName?: string
  highestFromName?: string
}

/**
 * Derive visa-type processing timeline from active jurisdictions:
 * - lower = min(minDays across jurisdictions)
 * - highest = max(maxDays across jurisdictions)
 */
export function resolveVisaTypeProcessingTimelineFromJurisdictions(
  visaType: Pick<CountryVisaType, 'jurisdictionEnabled' | 'processingTime' | 'jurisdictions'>,
): VisaTypeProcessingTimelineResolution {
  const { jurisdictionEnabled, processingTime } = visaType

  if (jurisdictionEnabled === true) {
    const activeJurisdictions = (visaType.jurisdictions ?? []).filter((j) => j.status === 'active')
    const ranges = activeJurisdictions
      .map((j) => {
        const range = parseProcessingDaysRange(j.processingTime)
        return range
          ? { jurisdiction: j, ...range }
          : { jurisdiction: j, min: null, max: null }
      })
      .filter((r) => r.min != null && r.max != null)

    if (ranges.length === 0) {
      return {
        timeline: processingTime?.trim() || 'TBD',
        lowerDays: null,
        highestDays: null,
      }
    }

    const lowerDays = Math.min(...ranges.map((r) => r.min))
    const highestDays = Math.max(...ranges.map((r) => r.max))

    const lowest = ranges.find((r) => r.min === lowerDays)
    const highest = ranges.find((r) => r.max === highestDays)

    const timeline =
      lowerDays === highestDays
        ? `${lowerDays} business days`
        : `${lowerDays}-${highestDays} business days`

    return {
      timeline,
      lowerDays,
      highestDays,
      lowestFromName: lowest ? pickDisplayName(lowest.jurisdiction) : undefined,
      highestFromName: highest ? pickDisplayName(highest.jurisdiction) : undefined,
    }
  }

  // When jurisdiction nodes are disabled, fall back to the configured visaType.processingTime.
  const baseRange = parseProcessingDaysRange(processingTime ?? '') ?? null
  const lowerDays = baseRange?.min ?? null
  const highestDays = baseRange?.max ?? (baseRange?.min ?? null)

  const fallbackTimeline = processingTime?.trim() || 'TBD'
  return {
    timeline: fallbackTimeline,
    lowerDays,
    highestDays,
  }
}

// Re-export to keep import compatibility if any older callsites relied on this name.
export { parseProcessingWorkingDays }

