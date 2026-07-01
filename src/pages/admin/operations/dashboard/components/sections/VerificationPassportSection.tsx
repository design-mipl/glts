import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { BaseCard, useToast } from '@/design-system/UIComponents'
import { DashboardSectionTable } from '../DashboardSectionTable'
import { buildPassportTransitColumns } from '../columns/passportTransitColumns'
import { buildVerificationQueueColumns } from '../columns/verificationQueueColumns'
import type {
  PassportTrackerSummary,
  PassportTransitRow,
  VerificationQueueRow,
} from '../../data/operationsDashboardMock'

function PassportSummaryCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent: 'primary' | 'warning' | 'success'
}) {
  const theme = useTheme()
  const color = theme.palette[accent].main

  return (
    <BaseCard sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ p: 1.5 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}
        >
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5, color }}>
          {value.toLocaleString()}
        </Typography>
      </Box>
    </BaseCard>
  )
}

export interface VerificationPassportSectionProps {
  verificationQueue: VerificationQueueRow[]
  passportSummary: PassportTrackerSummary
  passportTransit: PassportTransitRow[]
  getVerificationCellValue: (row: VerificationQueueRow, key: string) => string
  getPassportTransitCellValue: (row: PassportTransitRow, key: string) => string
  loading?: boolean
}

export function VerificationPassportSection({
  verificationQueue,
  passportSummary,
  passportTransit,
  getVerificationCellValue,
  getPassportTransitCellValue,
  loading = false,
}: VerificationPassportSectionProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const verificationColumns = useMemo(
    () =>
      buildVerificationQueueColumns({
        onView: (row) =>
          showToast({ title: `Opening ${row.glNumber}`, variant: 'info' }),
      }),
    [showToast],
  )

  const passportColumns = useMemo(() => buildPassportTransitColumns(), [])

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 7.8 }}>
        <DashboardSectionTable
          title="Pending verification queue"
          subtitle="Applications awaiting document verification and QC"
          columns={verificationColumns}
          data={verificationQueue}
          rowKey="id"
          getCellValue={getVerificationCellValue}
          loading={loading}
          onViewAll={() => navigate('/admin/application-management/marine')}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4.2 }}>
        <Stack spacing={2}>
          <BaseCard>
            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
              <Typography variant="subtitle2" fontWeight={700}>
                Passport tracker
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Delivery status and in-transit passports
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ px: 2, pb: 2 }}>
              <PassportSummaryCard
                label="Not Out For Delivery"
                value={passportSummary.notOutForDelivery}
                accent="warning"
              />
              <PassportSummaryCard
                label="In Transit"
                value={passportSummary.inTransit}
                accent="primary"
              />
              <PassportSummaryCard
                label="Delivered"
                value={passportSummary.delivered}
                accent="success"
              />
            </Stack>
          </BaseCard>
          <DashboardSectionTable
            title="In-transit passports"
            subtitle="Recent courier movements"
            columns={passportColumns}
            data={passportTransit}
            rowKey="id"
            getCellValue={getPassportTransitCellValue}
            loading={loading}
            pageSize={4}
            onViewAll={() => navigate('/admin/ground-operations/logistics')}
          />
        </Stack>
      </Grid>
    </Grid>
  )
}
