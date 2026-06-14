import { ActivityFeed } from '@/design-system/UIComponents'
import type { Vendor } from '@/shared/types/vendor'

export function VendorActivityTab({ vendor }: { vendor: Vendor }) {
  return (
    <ActivityFeed
      items={vendor.activities.map((a) => ({
        id: a.id,
        user: { name: a.actor },
        action: a.action,
        target: a.detail,
        timestamp: a.timestamp,
      }))}
    />
  )
}
