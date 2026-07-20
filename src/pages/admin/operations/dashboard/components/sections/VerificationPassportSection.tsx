import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import {
  DashboardSectionTable,
  executiveCardLevel2Sx,
} from '@/pages/admin/dashboard/components'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { buildPassportTransitColumns } from '../columns/passportTransitColumns'
import { buildVerificationQueueColumns } from '../columns/verificationQueueColumns'
import type {
  PassportTrackerSummary,
  PassportTransitRow,
  VerificationQueueRow,
} from '../../data/operationsDashboardMock'

function PassportStatCard({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'warning' | 'info' | 'success'
}) {
  const colors = usePublicBrandColors()
  const toneMap = {
    warning: { bg: 'rgba(245, 158, 11, 0.12)', text: '#B45309' },
    info: { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563EB' },
    success: { bg: colors.greenMuted, text: colors.greenDark },
  }
  const style = toneMap[tone]

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        p: 1.5,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        bgcolor: style.bg,
      }}
    >
      <Typography sx={{ fontSize: 10, fontWeight: 800, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 24, fontWeight: 900, color: style.text, lineHeight: 1.1, mt: 0.5 }}>
        {value.toLocaleString()}
      </Typography>
    </Box>
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
  const colors = usePublicBrandColors()
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
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <DashboardSectionTable
          title="Pending verification queue"
          subtitle="Applications awaiting document verification and QC."
          actionLabel="View queue"
          columns={verificationColumns}
          data={verificationQueue}
          rowKey="id"
          getCellValue={getVerificationCellValue}
          loading={loading}
          onViewAll={() => navigate('/admin/application-management/marine')}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack spacing={2.5}>
          <Box sx={{ ...executiveCardLevel2Sx(colors), p: 2 }}>
            <Box sx={{ mb: 1.5 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 15, color: colors.navy }}>
                Passport tracker
              </Typography>
              <Typography sx={{ fontSize: 12, color: colors.textMuted, mt: 0.25 }}>
                Delivery status summary
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <PassportStatCard
                label="Not out for delivery"
                value={passportSummary.notOutForDelivery}
                tone="warning"
              />
              <PassportStatCard
                label="In transit"
                value={passportSummary.inTransit}
                tone="info"
              />
              <PassportStatCard
                label="Delivered"
                value={passportSummary.delivered}
                tone="success"
              />
            </Stack>
          </Box>
          <DashboardSectionTable
            title="Recent in-transit passports"
            subtitle="Courier movements and delivery ETAs."
            actionLabel="View details"
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
