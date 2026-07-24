import { useMemo, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { FormField, Select } from '@/design-system/UIComponents'
import { AlertPanel, ExecutiveCard } from '../../dashboard-ui-kit'
import type { ManagementAlertRecord } from '../types'
import {
  managementAlertToListItem,
  sortManagementAlerts,
  type ManagementAlertSortKey,
} from './sortAlerts'

export interface ManagementAlertCenterProps {
  title?: string
  subtitle?: string
  alerts: ManagementAlertRecord[]
  loading?: boolean
  defaultSort?: ManagementAlertSortKey
}

/**
 * Executive alert center — business impact, not notification feed.
 */
export function ManagementAlertCenter({
  title = 'Management alerts',
  subtitle = 'Ranked by business impact',
  alerts,
  loading,
  defaultSort = 'severity',
}: ManagementAlertCenterProps) {
  const [sortBy, setSortBy] = useState<ManagementAlertSortKey>(defaultSort)

  const sorted = useMemo(() => sortManagementAlerts(alerts, sortBy), [alerts, sortBy])

  return (
    <ExecutiveCard title={title} subtitle={subtitle} loading={loading} empty={alerts.length === 0}>
      <Stack spacing={1.5}>
        <FormField label="Sort by">
          <Select
            size="sm"
            value={sortBy}
            options={[
              { label: 'Severity', value: 'severity' },
              { label: 'Financial impact', value: 'financial' },
              { label: 'Segment', value: 'segment' },
              { label: 'Status', value: 'status' },
              { label: 'Title', value: 'title' },
            ]}
            onChange={(value) => setSortBy(String(value) as ManagementAlertSortKey)}
          />
        </FormField>
        <Typography variant="caption" color="text.secondary">
          Critical · High · Medium · Low — includes impact, owner, and recommended action.
        </Typography>
        <AlertPanel
          title="Prioritized actions"
          loading={loading}
          maxItems={12}
          items={sorted.map(managementAlertToListItem)}
        />
      </Stack>
    </ExecutiveCard>
  )
}

export { sortManagementAlerts, managementAlertToListItem }
export type { ManagementAlertSortKey }
