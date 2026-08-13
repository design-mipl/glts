import { Divider, Grid, Stack } from '@mui/material'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { DASHBOARD_SPACING } from '../../constants'
import type { DashboardClientIntelligenceData } from '../../types'
import { ClientMarginTablePanel } from './ClientMarginTablePanel'
import { ClientSegmentMixChart } from './ClientSegmentMixChart'
import { DashboardRankChart } from './DashboardRankChart'

export interface FinanceClientIntelligenceSectionsProps {
  data: DashboardClientIntelligenceData
  loading?: boolean
}

/** Portfolio · risk · margin client intelligence for finance dashboards. */
export function FinanceClientIntelligenceSections({
  data,
  loading,
}: FinanceClientIntelligenceSectionsProps) {
  return (
    <Stack spacing={DASHBOARD_SPACING.section} divider={<Divider flexItem />}>
      <Stack component="section" spacing={DASHBOARD_SPACING.field} aria-label="Portfolio">
        <ExecutiveSectionHeader
          title="Portfolio"
          description="Segment mix by account count and revenue contribution"
        />
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <ClientSegmentMixChart rows={data.clientRows} loading={loading} />
          </Grid>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <DashboardRankChart
              title="Top accounts by revenue"
              items={data.topRevenueClients}
              loading={loading}
              valueLabel="Revenue"
              initialTopN="5"
            />
          </Grid>
        </Grid>
      </Stack>

      <Stack component="section" spacing={DASHBOARD_SPACING.field} aria-label="Risk">
        <ExecutiveSectionHeader
          title="Risk"
          description="Accounts that need credit, collections, or reactivation attention"
        />
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <DashboardRankChart
              title="High-risk clients"
              items={data.highRiskClients}
              loading={loading}
              valueLabel="Risk"
              initialTopN="5"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DashboardRankChart
              title="Dormant clients"
              items={data.dormantClients}
              loading={loading}
              valueLabel="Idle"
              initialTopN="5"
            />
          </Grid>
        </Grid>
      </Stack>

      <Stack component="section" spacing={DASHBOARD_SPACING.field} aria-label="Margin">
        <ExecutiveSectionHeader
          title="Margin"
          description="Gross margin leaders and accounts that may need repricing"
        />
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <ClientMarginTablePanel
              title="High margin clients"
              description="Accounts with the strongest gross margin this period"
              items={data.highMarginClientIntelligence}
              loading={loading}
              sortDirection="desc"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ClientMarginTablePanel
              title="Low margin clients"
              description="Accounts below target margin — may need repricing review"
              items={data.lowMarginClientIntelligence}
              loading={loading}
              sortDirection="asc"
            />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  )
}
