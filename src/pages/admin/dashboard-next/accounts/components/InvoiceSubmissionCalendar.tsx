import { useMemo, useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Badge, Tabs, type Column } from '@/design-system/UIComponents'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { AccountsWorkListing } from './AccountsWorkListing'
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

function getCellValue(row: AccountsInvoiceSubmissionRow, key: string): string {
  const value = row[key as keyof AccountsInvoiceSubmissionRow]
  return value == null ? '' : String(value)
}

function statusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  const s = status.toLowerCase()
  if (s.includes('due')) return 'warning'
  if (s.includes('draft') || s.includes('ready')) return 'info'
  if (s.includes('pending')) return 'error'
  return 'neutral'
}

export interface InvoiceSubmissionCalendarProps {
  submissions: AccountsInvoiceSubmissionRow[]
  loading?: boolean
}

/** List + calendar views for upcoming invoice submissions. */
export function InvoiceSubmissionCalendar({
  submissions,
  loading,
}: InvoiceSubmissionCalendarProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list')

  const listColumns: Column<AccountsInvoiceSubmissionRow>[] = useMemo(
    () => [
      {
        key: 'company',
        label: 'Company Name',
        widthSize: 'lg',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'submissionDate',
        label: 'Online Submission Date',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'billingCycle',
        label: 'Billing Cycle',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'status',
        label: 'Status',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
        render: (_value, row) => <Badge label={row.status} color={statusColor(row.status)} />,
      },
    ],
    [],
  )

  return (
    <Box>
      <Box sx={{ mb: DASHBOARD_SPACING.field, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          size="sm"
          variant="underline"
          items={[
            { label: 'List view', value: 'list' },
            { label: 'Calendar view', value: 'calendar' },
          ]}
          value={view}
          onChange={(value) => setView(value as 'list' | 'calendar')}
        />
      </Box>

      {view === 'list' ? (
        <AccountsWorkListing
          title="Invoice submission calendar"
          description="Upcoming corporate and marine billing submissions"
          rows={submissions}
          columns={listColumns}
          getCellValue={getCellValue}
          loading={loading}
          searchPlaceholder="Search client, cycle, status…"
          exportFileName="invoice-submission-calendar"
          emptyTitle="No scheduled submissions"
          emptyDescription="Invoice submission reminders will appear here."
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
    </Box>
  )
}
