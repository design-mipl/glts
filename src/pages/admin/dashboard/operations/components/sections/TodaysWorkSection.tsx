import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Badge, BaseCard, useToast } from '@/design-system/UIComponents'
import { DashboardSectionTable } from '@/pages/admin/operations/dashboard/components/DashboardSectionTable'
import { buildAwaitingDocumentColumns } from '../columns/awaitingDocumentColumns'
import { buildCorrectionRequestColumns } from '../columns/correctionRequestColumns'
import type {
  AwaitingDocumentRow,
  CorrectionRequestRow,
  TodayTaskItem,
} from '../../data/operationsConsultantDashboardMock'
import { priorityColor, priorityLabel } from '../../utils/applyOperationsConsultantFilters'

function TodayTasksPanel({ tasks }: { tasks: TodayTaskItem[] }) {
  const theme = useTheme()

  return (
    <BaseCard sx={{ height: '100%' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Today&apos;s tasks
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Auto-generated operational tasks for today
        </Typography>
      </Box>
      <Stack spacing={1} sx={{ px: 2, pb: 2 }}>
        {tasks.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No tasks scheduled for today.
          </Typography>
        ) : (
          tasks.map((task) => (
            <Box
              key={task.id}
              sx={{
                p: 1.5,
                borderRadius: '10px',
                border: 1,
                borderColor: 'divider',
                bgcolor: alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {task.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                    Due {task.dueTime}
                  </Typography>
                </Box>
                <Stack alignItems="flex-end" spacing={0.5}>
                  <Badge label={`${task.taskCount} tasks`} color="info" size="sm" />
                  <Badge label={priorityLabel(task.priority)} color={priorityColor(task.priority)} size="sm" />
                </Stack>
              </Stack>
            </Box>
          ))
        )}
      </Stack>
    </BaseCard>
  )
}

export interface TodaysWorkSectionProps {
  todayTasks: TodayTaskItem[]
  correctionRequests: CorrectionRequestRow[]
  awaitingDocuments: AwaitingDocumentRow[]
  getCorrectionCellValue: (row: CorrectionRequestRow, key: string) => string
  getAwaitingDocumentCellValue: (row: AwaitingDocumentRow, key: string) => string
  loading?: boolean
}

export function TodaysWorkSection({
  todayTasks,
  correctionRequests,
  awaitingDocuments,
  getCorrectionCellValue,
  getAwaitingDocumentCellValue,
  loading = false,
}: TodaysWorkSectionProps) {
  const { showToast } = useToast()

  const correctionColumns = useMemo(
    () =>
      buildCorrectionRequestColumns({
        onView: (row) =>
          showToast({ title: `Opening ${row.applicationId}`, variant: 'info' }),
      }),
    [showToast],
  )

  const awaitingColumns = useMemo(
    () =>
      buildAwaitingDocumentColumns({
        onSendReminder: (row) =>
          showToast({
            title: 'Reminder sent',
            description: `Document reminder sent to ${row.applicant}.`,
            variant: 'success',
          }),
      }),
    [showToast],
  )

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 4 }}>
        <TodayTasksPanel tasks={todayTasks} />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <DashboardSectionTable
          title="Correction requests"
          subtitle="Applications requiring corrections"
          columns={correctionColumns}
          data={correctionRequests}
          rowKey="id"
          getCellValue={getCorrectionCellValue}
          loading={loading}
          pageSize={5}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <DashboardSectionTable
          title="Awaiting client documents"
          subtitle="Outstanding documents from clients"
          columns={awaitingColumns}
          data={awaitingDocuments}
          rowKey="id"
          getCellValue={getAwaitingDocumentCellValue}
          loading={loading}
          pageSize={5}
        />
      </Grid>
    </Grid>
  )
}
