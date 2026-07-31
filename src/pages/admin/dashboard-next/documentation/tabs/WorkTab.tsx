import { useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Tabs } from '@/design-system/UIComponents'
import { DASHBOARD_SPACING } from '../../shared'
import { applicationPipelineStageHref } from '../../shared/config/applicationPipeline'
import {
  DocumentationWorkListing,
  getDocumentationWorkCellValue,
} from '../components/DocumentationWorkListing'
import { buildDocWorkColumns } from '../components/docWorkColumns'
import type { DocWorkDeskId, DocumentationDashboardTabProps, DocumentationWorkRow } from '../types'

const WORK_DESKS: Array<{ value: DocWorkDeskId; label: string; description: string }> = [
  {
    value: 'submission_pending',
    label: 'Submission Pending',
    description:
      'Primary Docs queue — check/upload documents, QC, fill form, then Mark as submitted. Correction / blocked sends the case to Ops (Verification Pending).',
  },
  {
    value: 'pending_payment',
    label: 'Pending Payment',
    description: 'Update embassy / VFS fee payment when required before submission.',
  },
  {
    value: 'waiting_on_ops',
    label: 'Waiting on Ops',
    description:
      'Cases Docs flagged as Correction required or Document missing / blocked. Returns to Submission Pending after Ops updates.',
  },
]

export interface WorkTabProps extends DocumentationDashboardTabProps {
  initialDesk?: DocWorkDeskId
}

/** Work — Submission Pending · Pending Payment · Waiting on Ops. */
export function WorkTab({
  data,
  loading,
  onNavigate,
  onOpenApplication,
  initialDesk = 'submission_pending',
}: WorkTabProps) {
  const [desk, setDesk] = useState<DocWorkDeskId>(initialDesk)

  const rowsByDesk: Record<DocWorkDeskId, DocumentationWorkRow[]> = useMemo(
    () => ({
      submission_pending: data.submissionPendingRows,
      pending_payment: data.pendingPaymentRows,
      waiting_on_ops: data.waitingOnOpsRows,
    }),
    [data],
  )

  const tabItems = WORK_DESKS.map((d) => ({
    value: d.value,
    label: `${d.label} (${rowsByDesk[d.value].length})`,
  }))

  const active = WORK_DESKS.find((d) => d.value === desk) ?? WORK_DESKS[0]
  const rows = rowsByDesk[desk]
  const columns = useMemo(() => buildDocWorkColumns(), [])

  const amTab =
    desk === 'submission_pending'
      ? 'online_submission_pending'
      : desk === 'pending_payment'
        ? 'pending_payment'
        : 'verification_pending'

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={desk}
          onChange={(value) => setDesk(value as DocWorkDeskId)}
          variant="underline"
          size="sm"
          items={tabItems}
        />
      </Box>

      <DocumentationWorkListing<DocumentationWorkRow>
        title={active.label}
        description={active.description}
        rows={rows}
        columns={columns}
        getCellValue={getDocumentationWorkCellValue}
        loading={loading}
        onOpen={(row) => {
          onOpenApplication?.(row)
          onNavigate(row.applicationHref)
        }}
        onViewAll={() => onNavigate(applicationPipelineStageHref(amTab))}
        viewAllLabel="Open in Application Management"
        searchPlaceholder="Search GL, applicant, client, country…"
        exportFileName={`doc-${desk}`}
        emptyTitle={`No cases in ${active.label}`}
        emptyDescription={
          desk === 'waiting_on_ops'
            ? 'Cases you flag as correction or blocked will appear here until Ops returns them.'
            : 'New applications in this queue will appear here.'
        }
      />
    </Stack>
  )
}
