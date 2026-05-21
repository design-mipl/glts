import { Tabs } from '@/design-system/components'

import type { SxProps } from '@mui/material/styles'

export interface BillingStatusTabsProps {
  value: string
  onChange: (value: string) => void
  embedded?: boolean
  sx?: SxProps
}

const TAB_ITEMS = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'partially-paid', label: 'Partially Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'paid', label: 'Paid' },
]

export default function BillingStatusTabs({
  value,
  onChange,
  embedded = false,
  sx,
}: BillingStatusTabsProps) {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      variant="underline"
      items={TAB_ITEMS.map((tab) => ({
        label: tab.label,
        value: tab.value,
      }))}
      sx={[
        embedded ? { mb: 0, px: 2, minHeight: 44 } : { mb: 2 },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  )
}
