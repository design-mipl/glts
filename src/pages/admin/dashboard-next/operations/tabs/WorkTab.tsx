import { useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Tabs } from '@/design-system/UIComponents'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { OperationsWorkListing } from '../components/OperationsWorkListing'
import type {
  OperationsDashboardTabProps,
  OperationsWorkRow,
  OpsWorkQueueKind,
} from '../types'
import { opsApplicationListPath } from '../utils/opsSegmentPaths'

type WorkQueueTabId =
  | 'verification'
  | 'recheck'
  | 'payment'
  | 'glts_arrange'
  | 'submission'
  | 'collection'
  | 'correction_watch'

const WORK_QUEUE_TABS: Array<{
  value: WorkQueueTabId
  label: string
  queues: OpsWorkQueueKind[]
}> = [
  { value: 'verification', label: 'Verify', queues: ['verification'] },
  { value: 'recheck', label: 'Re-review', queues: ['recheck'] },
  { value: 'payment', label: 'Payment', queues: ['payment'] },
  { value: 'glts_arrange', label: 'Book', queues: ['glts_arrange'] },
  { value: 'submission', label: 'Submit', queues: ['submission'] },
  { value: 'collection', label: 'Collect', queues: ['collection'] },
  { value: 'correction_watch', label: 'Waiting', queues: ['correction_watch'] },
]

/** Personal desk only — team backlog lives on admin / lead dashboards. */
function isPersonalDeskRow(row: OperationsWorkRow): boolean {
  return !row.showGroundBadge && (row.assigneeKind === 'user' || row.assigneeKind === 'unassigned')
}

/**
 * Work tab — personal ops queue (verify, payment, book, submit).
 * Team-wide views belong on the admin / team-lead dashboard.
 */
export function WorkTab({
  data,
  loading,
  onNavigate,
  onOpenApplication,
}: OperationsDashboardTabProps) {
  const [queueTab, setQueueTab] = useState<WorkQueueTabId>('verification')

  const deskRows = useMemo(
    () => data.queueRows.filter(isPersonalDeskRow),
    [data.queueRows],
  )

  const rows = useMemo(() => {
    const def = WORK_QUEUE_TABS.find((t) => t.value === queueTab)
    if (!def) return deskRows
    return deskRows.filter((row) => def.queues.includes(row.queue))
  }, [deskRows, queueTab])

  const tabItems = WORK_QUEUE_TABS.map((t) => {
    const count = deskRows.filter((row) => t.queues.includes(row.queue)).length
    return { value: t.value, label: `${t.label} (${count})` }
  })

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={queueTab}
          onChange={(value) => setQueueTab(value as WorkQueueTabId)}
          variant="underline"
          size="sm"
          items={tabItems}
        />
      </Box>

      <OperationsWorkListing
        title="My work"
        description="Your desk — verify, payment, book, submit. Open the application case to continue."
        rows={rows}
        loading={loading}
        openLabel="Open case"
        onOpen={(row) => {
          if (onOpenApplication) onOpenApplication(row.applicationHref)
          else onNavigate(row.applicationHref)
        }}
        onViewAll={() => onNavigate(opsApplicationListPath('marine', 'verification_pending'))}
        viewAllLabel="Open applications"
        emptyTitle="No work in this queue"
        emptyDescription="Pick another queue tab or check Application Management."
      />
    </Stack>
  )
}
