import { ActivityFeed } from '@/design-system/UIComponents'
import type { CountryMaster } from '@/shared/types/countryMaster'
import { SEGMENT_LABELS } from '../../config/countrySegmentConfig'

interface ActivityTimelineTabProps {
  country: CountryMaster
}

export function ActivityTimelineTab({ country }: ActivityTimelineTabProps) {
  const items = country.activities.map((entry) => ({
    id: entry.id,
    user: { name: entry.actor },
    action: entry.action,
    target: [
      entry.detail,
      entry.segment ? `Segment: ${SEGMENT_LABELS[entry.segment]}` : undefined,
    ]
      .filter(Boolean)
      .join(' · '),
    timestamp: entry.timestamp,
  }))

  if (items.length === 0) {
    return null
  }

  return <ActivityFeed items={items} />
}
