import { useMemo, useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Badge, BaseCard, Tabs } from '@/design-system/UIComponents'
import { useToast } from '@/design-system/UIComponents'
import { DashboardSectionTable } from '@/pages/admin/operations/dashboard/components/DashboardSectionTable'
import { buildOutstandingCollectionsColumns } from '../columns/outstandingCollectionsColumns'
import type { InvoiceSubmissionRow, OutstandingCollectionRow } from '../../data/accountsDashboardMock'

function InvoiceSubmissionCalendar({ submissions }: { submissions: InvoiceSubmissionRow[] }) {
  const theme = useTheme()
  const daysInMonth = 31
  const startDayOffset = 1

  const submissionsByDay = useMemo(() => {
    const map = new Map<number, InvoiceSubmissionRow[]>()
    submissions.forEach((row) => {
      const day = row.submissionDateSort % 100
      const existing = map.get(day) ?? []
      map.set(day, [...existing, row])
    })
    return map
  }, [submissions])

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 0.5,
      }}
    >
      {Array.from({ length: startDayOffset }, (_, i) => (
        <Box key={`empty-${i}`} sx={{ minHeight: 48 }} />
      ))}
      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1
        const daySubmissions = submissionsByDay.get(day) ?? []
        const hasDueToday = daySubmissions.some((s) => s.status.toLowerCase().includes('due today'))
        return (
          <Box
            key={day}
            sx={{
              minHeight: 48,
              p: 0.5,
              borderRadius: '8px',
              border: 1,
              borderColor: hasDueToday ? theme.palette.warning.main : 'divider',
              bgcolor: hasDueToday ? alpha(theme.palette.warning.main, 0.08) : 'background.paper',
            }}
          >
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              {day}
            </Typography>
            {daySubmissions.slice(0, 2).map((sub) => (
              <Typography
                key={sub.id}
                variant="caption"
                sx={{
                  display: 'block',
                  fontSize: 10,
                  lineHeight: 1.2,
                  mt: 0.25,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {sub.company.split(' ')[0]}
              </Typography>
            ))}
            {daySubmissions.length > 2 ? (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                +{daySubmissions.length - 2}
              </Typography>
            ) : null}
          </Box>
        )
      })}
    </Box>
  )
}

function InvoiceSubmissionList({ submissions }: { submissions: InvoiceSubmissionRow[] }) {
  return (
    <Stack spacing={1}>
      {submissions.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          No scheduled submissions for this period.
        </Typography>
      ) : (
        submissions.map((row) => (
          <Box
            key={row.id}
            sx={{
              p: 1.25,
              borderRadius: '10px',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600}>
                  {row.company}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.submissionDate} · {row.billingCycle}
                </Typography>
              </Box>
              <Badge
                label={row.status}
                color={row.status.toLowerCase().includes('due') ? 'warning' : 'info'}
                size="sm"
              />
            </Stack>
          </Box>
        ))
      )}
    </Stack>
  )
}

export interface CreditControlSectionProps {
  outstandingCollections: OutstandingCollectionRow[]
  invoiceSubmissions: InvoiceSubmissionRow[]
  getOutstandingCollectionCellValue: (row: OutstandingCollectionRow, key: string) => string
  loading?: boolean
}

export function CreditControlSection({
  outstandingCollections,
  invoiceSubmissions,
  getOutstandingCollectionCellValue,
  loading = false,
}: CreditControlSectionProps) {
  const { showToast } = useToast()
  const [calendarView, setCalendarView] = useState<'list' | 'calendar'>('list')

  const columns = useMemo(
    () =>
      buildOutstandingCollectionsColumns({
        onFollowUp: (row) =>
          showToast({
            title: 'Follow-up recorded',
            description: `Follow-up logged for ${row.invoice}.`,
            variant: 'success',
          }),
        onUpdateStatus: (row) =>
          showToast({
            title: 'Collection status updated',
            description: `${row.invoice} status refreshed.`,
            variant: 'info',
          }),
      }),
    [showToast],
  )

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardSectionTable
          title="Outstanding collections"
          subtitle="Credit control follow-ups and collection status"
          columns={columns}
          data={outstandingCollections}
          rowKey="id"
          getCellValue={getOutstandingCollectionCellValue}
          loading={loading}
          pageSize={6}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <BaseCard sx={{ height: '100%' }}>
          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Invoice submission calendar
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Scheduled invoice submission dates
            </Typography>
          </Box>
          <Box sx={{ px: 2, pb: 1 }}>
            <Tabs
              size="sm"
              items={[
                { label: 'List view', value: 'list' },
                { label: 'Calendar view', value: 'calendar' },
              ]}
              value={calendarView}
              onChange={(value) => setCalendarView(value as 'list' | 'calendar')}
            />
          </Box>
          <Box sx={{ px: 2, pb: 2 }}>
            {calendarView === 'list' ? (
              <InvoiceSubmissionList submissions={invoiceSubmissions} />
            ) : (
              <InvoiceSubmissionCalendar submissions={invoiceSubmissions} />
            )}
          </Box>
        </BaseCard>
      </Grid>
    </Grid>
  )
}
