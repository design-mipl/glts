import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  Badge,
  BaseCard,
  Button,
  DataTable,
  RowActions,
  useToast,
} from '@/design-system/UIComponents'
import type { Column, RowAction, TableState } from '@/design-system/UIComponents'
import { INITIAL_TABLE_STATE } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import type { DashboardQueueRow, Priority, SlaStatus } from '../data/operationsDashboardMock'

function slaLabel(status: SlaStatus): string {
  if (status === 'on_track') return 'On track'
  if (status === 'at_risk') return 'At risk'
  return 'Breached'
}

function slaColor(status: SlaStatus): 'success' | 'warning' | 'error' {
  if (status === 'on_track') return 'success'
  if (status === 'at_risk') return 'warning'
  return 'error'
}

function priorityLabel(priority: Priority): string {
  if (priority === 'high') return 'High'
  if (priority === 'medium') return 'Medium'
  return 'Low'
}

function priorityColor(priority: Priority): 'error' | 'warning' | 'neutral' {
  if (priority === 'high') return 'error'
  if (priority === 'medium') return 'warning'
  return 'neutral'
}

const QUEUE_TABLE_STATE: TableState = {
  ...INITIAL_TABLE_STATE,
  pageSize: 6,
}

function buildQueueColumns(
  showToast: (toast: { title: string; variant: 'info' }) => void,
): Column<DashboardQueueRow>[] {
  return [
    { key: 'applicationId', label: 'Application ID', minWidth: 140, sortable: true, hideable: false },
    { key: 'applicant', label: 'Applicant', minWidth: 180, sortable: true },
    { key: 'country', label: 'Country', minWidth: 120, sortable: true },
    { key: 'visaType', label: 'Visa Type', minWidth: 140, sortable: true },
    { key: 'assignedTeam', label: 'Assigned Team', minWidth: 150, sortable: true },
    {
      key: 'slaStatus',
      label: 'SLA Status',
      minWidth: 110,
      render: (_, row) => <Badge label={slaLabel(row.slaStatus)} color={slaColor(row.slaStatus)} size="sm" />,
    },
    {
      key: 'priority',
      label: 'Priority',
      minWidth: 90,
      render: (_, row) => (
        <Badge label={priorityLabel(row.priority)} color={priorityColor(row.priority)} size="sm" />
      ),
    },
    {
      key: 'actions',
      label: '',
      width: 60,
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      align: 'center',
      render: (_, row) => {
        const actions: RowAction[] = [
          {
            label: 'View',
            onClick: () => showToast({ title: `Opening ${row.applicationId}`, variant: 'info' }),
          },
          {
            label: 'Assign',
            onClick: () => showToast({ title: `Assign team for ${row.applicationId}`, variant: 'info' }),
          },
          {
            label: 'Open',
            onClick: () => showToast({ title: `Opened ${row.applicationId}`, variant: 'info' }),
          },
        ]
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}

export interface DashboardQueueTableProps {
  title: string
  subtitle?: string
  rows: DashboardQueueRow[]
}

export function DashboardQueueTable({ title, subtitle, rows }: DashboardQueueTableProps) {
  const { showToast } = useToast()
  const [state, setState] = useState<TableState>(QUEUE_TABLE_STATE)
  const columns = useMemo(
    () =>
      buildQueueColumns((toast) =>
        showToast({ title: toast.title, variant: toast.variant }),
      ),
    [showToast],
  )

  return (
    <BaseCard sx={{ overflow: 'hidden' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ px: 2, pt: 2, pb: 1 }}
      >
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        <Button
          label="View all"
          variant="text"
          size="sm"
          onClick={() => showToast({ title: `Opening ${title}`, variant: 'info' })}
        />
      </Stack>
      <Box sx={{ px: 0, pb: 0 }}>
        <DataTable
          columns={columns}
          data={rows}
          rowKey="id"
          state={state}
          onStateChange={setState}
          embedded
          hideToolbar
          hidePagination
          stickyHeader
          enableColumnSort={false}
          showColumnSearch={false}
          emptyState={{
            title: 'No records in queue',
            description: 'Adjust filters or check back later.',
          }}
        />
      </Box>
    </BaseCard>
  )
}
