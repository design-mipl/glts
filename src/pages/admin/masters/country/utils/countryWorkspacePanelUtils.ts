import type { BusinessSegment, CountryMaster } from '@/shared/types/countryMaster'
import { formatConfigNodePath } from '@/shared/utils/countryConfigValidation'
import { SEGMENT_LABELS } from '../config/countrySegmentConfig'
import { PROCESSING_TYPE_LABELS } from '../config/countryProcessingConfig'

export type WorkspacePanelKind =
  | 'overview'
  | 'review'
  | 'segment'
  | 'visaType'
  | 'jurisdiction'

export interface WorkspacePanelMeta {
  kind: WorkspacePanelKind
  title: string
  subtitle: string
  metaTags: string[]
}

/** Parent hierarchy path for the panel header (excludes the current node title when duplicated). */
export function getWorkspacePanelHierarchy(subtitle: string, title: string): string {
  const parts = subtitle.split(' > ').filter(Boolean)
  if (parts.length <= 1) return parts[0] ?? ''

  const last = parts[parts.length - 1]
  if (last === title) return parts.slice(0, -1).join(' › ')

  return parts.join(' › ')
}

export function getWorkspacePanelMeta(
  country: CountryMaster,
  activeNode: string,
  nodeParts: {
    type: WorkspacePanelKind
    segment?: BusinessSegment
    visaTypeId?: string
    jurisdictionId?: string
  },
): WorkspacePanelMeta {
  const path = formatConfigNodePath(country, activeNode)

  if (nodeParts.type === 'overview') {
    return {
      kind: 'overview',
      title: 'Country overview',
      subtitle: `${country.name} > Overview`,
      metaTags: [
        country.code,
        country.region,
        PROCESSING_TYPE_LABELS[country.processingType],
        country.status,
      ],
    }
  }

  if (nodeParts.type === 'review') {
    return {
      kind: 'review',
      title: 'Review & publish',
      subtitle: path,
      metaTags: ['Validation summary'],
    }
  }

  if (nodeParts.type === 'segment' && nodeParts.segment) {
    const seg = country.segments.find((s) => s.segment === nodeParts.segment)
    return {
      kind: 'segment',
      title: `${SEGMENT_LABELS[nodeParts.segment]} segment`,
      subtitle: path,
      metaTags: [
        seg?.enabled ? 'Enabled' : 'Disabled',
        `${seg?.visaTypes.length ?? 0} visa types`,
      ],
    }
  }

  if (nodeParts.type === 'visaType' && nodeParts.segment && nodeParts.visaTypeId) {
    const vt = country.segments
      .find((s) => s.segment === nodeParts.segment)
      ?.visaTypes.find((v) => v.id === nodeParts.visaTypeId)
    return {
      kind: 'visaType',
      title: vt?.name ?? 'Visa type',
      subtitle: path,
      metaTags: [vt?.visaCategory ?? 'Visa', vt?.status ?? 'active'],
    }
  }

  if (
    nodeParts.type === 'jurisdiction' &&
    nodeParts.segment &&
    nodeParts.visaTypeId &&
    nodeParts.jurisdictionId
  ) {
    const jur = country.segments
      .find((s) => s.segment === nodeParts.segment)
      ?.visaTypes.find((v) => v.id === nodeParts.visaTypeId)
      ?.jurisdictions?.find((j) => j.id === nodeParts.jurisdictionId)
    return {
      kind: 'jurisdiction',
      title: jur?.name ?? 'Jurisdiction',
      subtitle: path,
      metaTags: [jur?.submissionCenter ?? 'Submission center', jur?.status ?? 'active'],
    }
  }

  return {
    kind: 'overview',
    title: country.name,
    subtitle: path,
    metaTags: [],
  }
}
