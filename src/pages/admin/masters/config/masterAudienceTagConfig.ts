import type { TagVariant } from '@/design-system/UIComponents/Display/Tag'
import { SEGMENT_LABELS } from '@/shared/data/countryMasterDefaults'
import type { BusinessSegment } from '@/shared/types/countryMaster'
import type { MasterApplicability } from '@/shared/types/masterCommon'
import { MASTER_APPLICABILITY_OPTIONS } from '@/shared/types/masterCommon'

/** Stable tag colors for marine / corporate / retail / B2B across admin master listings. */
const MASTER_AUDIENCE_TAG_VARIANTS: Record<string, TagVariant> = {
  marine: 'info',
  corporate: 'default',
  retail: 'success',
  b2b: 'warning',
  b2bAgents: 'warning',
}

export interface MasterAudienceTagItem {
  key: string
  label: string
}

export function getMasterAudienceTagVariant(key: string): TagVariant {
  return MASTER_AUDIENCE_TAG_VARIANTS[key] ?? 'neutral'
}

export function toApplicabilityTagItems(values: MasterApplicability[]): MasterAudienceTagItem[] {
  return values.map((key) => ({
    key,
    label: MASTER_APPLICABILITY_OPTIONS.find((option) => option.value === key)?.label ?? key,
  }))
}

export function toSegmentTagItems(values: BusinessSegment[]): MasterAudienceTagItem[] {
  return values.map((key) => ({
    key,
    label: SEGMENT_LABELS[key],
  }))
}
