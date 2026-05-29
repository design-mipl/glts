import { ActivityFeed } from '@/design-system/UIComponents'
import type { EnquiryRecord } from '@/shared/types/enquiry'

export function ActivityTimelineTab({ enquiry }: { enquiry: EnquiryRecord }) {
  const items = enquiry.activities.map((activity) => ({
    id: activity.id,
    user: { name: activity.actor },
    action: activity.title,
    target: activity.description,
    timestamp: activity.timestamp,
  }))

  return <ActivityFeed items={items} emptyText="No activity recorded for this enquiry yet." />
}
