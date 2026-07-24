import { useMemo, useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Badge, Tabs } from '@/design-system/UIComponents'
import { ExecutiveCard } from '../../shared/dashboard-ui-kit'
import { DashboardTable, StatusBadge, DASHBOARD_SPACING } from '../../shared'
import type { Column } from '@/design-system/UIComponents'
import type { AccountsInvoiceSubmissionRow } from '../types'

function CalendarGrid({ submissions }: { submissions: AccountsInvoiceSubmissionRow[] }) {
  const theme = useTheme()
  const daysInMonth = 31
  const startDayOffset = 1

  const submissionsByDay = useMemo(() => {
    const map = new Map<number, AccountsInvoiceSubmissionRow[]>()
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
              bgcolor: hasDueToday
                ? alpha(theme.palette.warning.main, 0.08)
                : 'background.paper',
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
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: 'text.primary',
                  fontSize: 10,
                }}
              >
                {sub.company}
              </Typography>
            ))}
          </Box>
        )
      })}
    </Box>
  )
}

const listColumns: Column<AccountsInvoiceSubmissionRow>[] = [
  { key: 'company', label: 'Company', widthSize: 'lg', sortable: false },
  { key: 'submissionDate', label: 'Submission date', widthSize: 'md', sortable: false },
  { key: 'billingCycle', label: 'Billing cycle', widthSize: 'md', sortable: false },
  {
    key: 'status',
    label: 'Status',
    widthSize: 'sm',
    sortable: false,
    render: (_value, row) => <StatusBadge label={row.status} status={row.status} />,
  },
  { key: 'branch', label: 'Branch', widthSize: 'md', sortable: false },
]

export interface InvoiceSubmissionCalendarProps {
  submissions: AccountsInvoiceSubmissionRow[]
  loading?: boolean
}

/** List + calendar views for upcoming invoice submissions (Original Accounts carry-forward). */
export function InvoiceSubmissionCalendar({
  submissions,
  loading,
}: InvoiceSubmissionCalendarProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list')

  return (
    <ExecutiveCard
      title="Invoice submission calendar"
      subtitle="Upcoming corporate and marine billing submissions"
      density="comfortable"
    >
      <Box sx={{ mb: DASHBOARD_SPACING.field }}>
        <Tabs
          size="sm"
          items={[
            { label: 'List view', value: 'list' },
            { label: 'Calendar view', value: 'calendar' },
          ]}
          value={view}
          onChange={(value) => setView(value as 'list' | 'calendar')}
        />
      </Box>

      {view === 'list' ? (
        <DashboardTable
          title="Scheduled submissions"
          columns={listColumns}
          data={submissions}
          rowKey="id"
          loading={loading}
          pageSize={5}
        />
      ) : (
        <Grid container spacing={1}>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Badge label={`${submissions.length} scheduled`} color="info" />
              <Badge
                label={`${submissions.filter((s) => s.status.toLowerCase().includes('due')).length} due soon`}
                color="warning"
              />
            </Box>
            <CalendarGrid submissions={submissions} />
          </Grid>
        </Grid>
      )}
    </ExecutiveCard>
  )
}
