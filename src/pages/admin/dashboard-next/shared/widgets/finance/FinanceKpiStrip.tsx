import type { ReactNode } from 'react'
import { Box, Stack, Typography, alpha } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { AlertTriangle, Clock, FileText, HandCoins, Percent, Wallet } from 'lucide-react'
import { HeroMetric } from '../../dashboard-ui-kit'
import { floorStatusTone } from '../../utils/managementFinanceSelectors'
import type { DashboardFinanceKpiStrip, DashboardFinanceRiskCallouts } from '../../types'

export interface FinanceExecutiveHeaderProps {
  kpiStrip: DashboardFinanceKpiStrip
  riskCallouts: DashboardFinanceRiskCallouts
  loading?: boolean
  onAvailableFundsClick?: () => void
  onOverdueClick?: () => void
  onCreditExposureClick?: () => void
  onSlaCashClick?: () => void
}

const kpiGridSx = {
  display: 'grid',
  gap: 1,
  alignItems: 'stretch',
  gridTemplateColumns: {
    xs: 'repeat(2, minmax(0, 1fr))',
    md: 'repeat(3, minmax(0, 1fr))',
    xl: 'repeat(5, minmax(0, 1fr))',
  },
} as const

function KpiCell({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
  if (!onClick) return <Box sx={{ minWidth: 0, height: '100%' }}>{children}</Box>
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      sx={{
        minWidth: 0,
        height: '100%',
        cursor: 'pointer',
        outline: 'none',
        '&:focus-visible': { borderRadius: 2, boxShadow: (t) => `0 0 0 2px ${t.palette.primary.main}` },
      }}
    >
      {children}
    </Box>
  )
}

function RiskChip({
  label,
  value,
  helper,
  icon,
  tone,
  onClick,
}: {
  label: string
  value: string
  helper: string
  icon: ReactNode
  tone: 'warning' | 'negative'
  onClick?: () => void
}) {
  const theme = useTheme()
  const color = tone === 'negative' ? theme.palette.error.main : theme.palette.warning.dark
  const bg = tone === 'negative' ? alpha(theme.palette.error.main, 0.08) : alpha(theme.palette.warning.main, 0.1)

  return (
    <Box
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      sx={{
        px: 1.25,
        py: 1,
        borderRadius: '10px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: bg,
        cursor: onClick ? 'pointer' : 'default',
        minWidth: 0,
        flex: 1,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{ color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{icon}</Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: 10, lineHeight: 1.2 }}>
            {label}
          </Typography>
          <Typography fontWeight={800} sx={{ fontSize: 14, lineHeight: 1.15, color }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, display: 'block' }}>
            {helper}
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}

/** Compact executive header — five KPIs + inline risk callouts. */
export function FinanceExecutiveHeader({
  kpiStrip: data,
  riskCallouts,
  loading,
  onAvailableFundsClick,
  onOverdueClick,
  onCreditExposureClick,
  onSlaCashClick,
}: FinanceExecutiveHeaderProps) {
  const fundsTone = floorStatusTone(data.availableFundsStatus)
  const marginUp = data.grossMarginDeltaPp >= 0
  const dsoImproved = data.dsoDeltaDays <= 0

  return (
    <Stack spacing={1}>
      <Box role="group" aria-label="Finance KPIs" sx={kpiGridSx}>
        <KpiCell onClick={onAvailableFundsClick}>
          <HeroMetric
            label="Available funds"
            value={data.availableFunds}
            helperText={`${data.availableFundsFloor} · ${data.availableFundsStatusLabel}`}
            icon={<Wallet />}
            tone={fundsTone === 'positive' ? 'positive' : fundsTone === 'warning' ? 'warning' : 'negative'}
            loading={loading}
            animate={false}
          />
        </KpiCell>
        <KpiCell>
          <HeroMetric
            label="Net revenue MTD"
            value={data.netRevenueMtd}
            helperText={`Target ${data.netRevenueTarget} · ${data.netRevenueTargetPercent}% · ${data.netRevenueGrowthAmount}`}
            delta={data.netRevenueGrowthPercent}
            deltaLabel="vs prior month"
            tone="info"
            loading={loading}
            animate={false}
          />
        </KpiCell>
        <KpiCell>
          <HeroMetric
            label="Gross margin"
            value={`${data.grossMarginPercent}%`}
            helperText={`Prior ${data.grossMarginPriorPercent}%`}
            delta={marginUp ? data.grossMarginDeltaPp : -data.grossMarginDeltaPp}
            deltaLabel="pp vs prior"
            icon={<Percent />}
            tone={marginUp ? 'positive' : 'negative'}
            loading={loading}
            animate={false}
          />
        </KpiCell>
        <KpiCell onClick={onOverdueClick}>
          <HeroMetric
            label="Overdue receivables"
            value={data.overdueAmount}
            helperText={`${data.overdueInvoiceCount} invoices`}
            icon={<FileText />}
            tone="negative"
            loading={loading}
            animate={false}
          />
        </KpiCell>
        <KpiCell>
          <HeroMetric
            label="DSO"
            value={`${data.dsoDays}d`}
            helperText={`Prior ${data.dsoPriorDays}d`}
            delta={dsoImproved ? -data.dsoDeltaDays : data.dsoDeltaDays}
            deltaLabel="days vs prior"
            icon={<Clock />}
            tone={dsoImproved ? 'positive' : 'warning'}
            loading={loading}
            animate={false}
          />
        </KpiCell>
      </Box>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        role="group"
        aria-label="Finance risk callouts"
        sx={{ pt: 0.25 }}
      >
        <RiskChip
          label="Credit exposure"
          value={riskCallouts.creditExposure}
          helper={riskCallouts.creditExposureTop5}
          icon={<HandCoins size={16} />}
          tone="warning"
          onClick={onCreditExposureClick}
        />
        <RiskChip
          label="SLA cash at risk"
          value={riskCallouts.slaCashAtRisk}
          helper={`${riskCallouts.slaCashAtRiskCases} cases`}
          icon={<AlertTriangle size={16} />}
          tone="negative"
          onClick={onSlaCashClick}
        />
      </Stack>
    </Stack>
  )
}

// Back-compat re-export
export type FinanceKpiStripProps = Omit<FinanceExecutiveHeaderProps, 'riskCallouts'> & {
  data: DashboardFinanceKpiStrip
}

export function FinanceKpiStrip({
  data,
  loading,
  onAvailableFundsClick,
  onOverdueClick,
}: FinanceKpiStripProps) {
  return (
    <FinanceExecutiveHeader
      kpiStrip={data}
      riskCallouts={{
        creditExposure: '—',
        creditExposureTop5: '',
        slaCashAtRisk: '—',
        slaCashAtRiskCases: 0,
      }}
      loading={loading}
      onAvailableFundsClick={onAvailableFundsClick}
      onOverdueClick={onOverdueClick}
    />
  )
}
