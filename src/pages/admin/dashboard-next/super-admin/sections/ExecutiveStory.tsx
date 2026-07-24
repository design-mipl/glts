import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  Anchor,
  Briefcase,
  Building2,
  ClipboardList,
  HandCoins,
  LayoutDashboard,
  Ship,
  Store,
  Users,
} from 'lucide-react'
import {
  ApplicationPipeline,
  BranchPerformance,
  BusinessSegmentBreakdown,
  CollectionSummary,
  CountryDistribution,
  AgeingAnalysis,
  MarineTimeline,
  MetricComparison,
  OperationsHealth,
  PassportJourney,
  ProcessingTrend,
  QuickActions,
  QuickStats,
  RecentActivity,
  RevenueSnapshot,
  RiskOverview,
  SLAOverview,
  TeamCapacity,
  VisaDistribution,
  DASHBOARD_SPACING,
} from '../../shared'
import {
  AlertPanel,
  ComparisonLayout,
  ExecutiveGrid,
  ExecutiveSection,
  HeroMetric,
  HeroSection,
  HighlightCard,
  InsightCard,
  InsightStack,
  ProgressMetric,
  RankingList,
  SectionDivider,
  SegmentCard,
} from '../../shared/dashboard-ui-kit'
import {
  ExecutiveInsightCard,
  InsightBanner,
  IntelligenceRecommendationPanel,
  ManagementAlertCenter,
  PredictivePanel,
  useDrilldownOptional,
} from '../../shared/dashboard-intelligence'
import type { SuperAdminExecutiveStoryProps, SuperAdminRankItem } from '../types'

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-admin-next': <LayoutDashboard size={18} />,
  'qa-ops-next': <ClipboardList size={18} />,
  'qa-accounts-next': <HandCoins size={18} />,
  'qa-clients': <Users size={18} />,
  'qa-finance': <HandCoins size={18} />,
  'qa-legacy-admin': <Building2 size={18} />,
}

const SEGMENT_ICONS = {
  marine: <Ship size={20} />,
  corporate: <Briefcase size={20} />,
  retail: <Store size={20} />,
  b2b: <Anchor size={20} />,
} as const

function toRankingItems(items: SuperAdminRankItem[]) {
  return items.map((item, index) => ({
    id: item.id,
    primary: item.primary,
    secondary: item.secondary,
    rank: index + 1,
    value: item.value,
    progress: item.progress,
  }))
}

function alertTone(severity: string) {
  switch (severity) {
    case 'critical':
      return 'negative' as const
    case 'warning':
      return 'warning' as const
    case 'success':
      return 'positive' as const
    default:
      return 'info' as const
  }
}

function alertBadge(severity: string) {
  switch (severity) {
    case 'critical':
      return 'Critical'
    case 'warning':
      return 'High'
    case 'info':
      return 'Medium'
    default:
      return 'Low'
  }
}

/**
 * Single-page executive story for Super Admin.
 * Composes Dashboard UI Kit + existing business widgets only.
 */
export function ExecutiveStory({
  data,
  loading,
  onRetry,
  onNavigate,
  onPipelineStageClick,
  insights = [],
  recommendations = [],
  managementAlerts,
  forecasts = [],
}: SuperAdminExecutiveStoryProps) {
  const drilldown = useDrilldownOptional()

  return (
    <InsightStack spacing={DASHBOARD_SPACING.section}>
      {/* 1. Executive Hero */}
      <HeroSection
        id="executive-hero"
        title="How is the business performing?"
        subtitle="Leadership snapshot across revenue, risk, and delivery."
        question="Company health at a glance"
      >
        <ExecutiveGrid columns={4} spacing={DASHBOARD_SPACING.field}>
          {data.heroKpis.map((kpi) => (
            <Box
              key={kpi.id}
              onClick={() =>
                drilldown?.openDrilldown({
                  id: `kpi-${kpi.id}`,
                  title: kpi.label,
                  subtitle: 'Hero KPI drilldown',
                  entityType: 'kpi',
                  entityId: kpi.id,
                  meta: { value: kpi.value, delta: kpi.delta },
                })
              }
              sx={{ cursor: drilldown ? 'pointer' : 'default', minWidth: 0 }}
              role={drilldown ? 'button' : undefined}
              tabIndex={drilldown ? 0 : undefined}
              onKeyDown={
                drilldown
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        drilldown.openDrilldown({
                          id: `kpi-${kpi.id}`,
                          title: kpi.label,
                          subtitle: 'Hero KPI drilldown',
                          entityType: 'kpi',
                          entityId: kpi.id,
                          meta: { value: kpi.value, delta: kpi.delta },
                        })
                      }
                    }
                  : undefined
              }
            >
              <HeroMetric
                label={kpi.label}
                value={kpi.value}
                delta={kpi.delta}
                deltaLabel={kpi.deltaLabel}
                loading={loading}
                animate
              />
            </Box>
          ))}
        </ExecutiveGrid>
        {insights.length > 0 ? (
          <Stack spacing={DASHBOARD_SPACING.field} sx={{ mt: DASHBOARD_SPACING.field }}>
            {insights.slice(0, 2).map((insight) => (
              <InsightBanner key={insight.id} insight={insight} />
            ))}
          </Stack>
        ) : null}
      </HeroSection>

      <SectionDivider label="Growth" />

      {/* 2. Revenue Trend */}
      <ExecutiveSection
        id="revenue-trend"
        title="Revenue trend"
        subtitle="Monthly revenue versus collections — primary board visualization."
        question="Are we growing sustainably?"
      >
        <ProcessingTrend
          title="Revenue vs collections"
          subtitle="₹ Cr · last seven months"
          points={data.revenueTrend}
          secondaryLabel="Collected"
          loading={loading}
          onRetry={onRetry}
        />
      </ExecutiveSection>

      <SectionDivider label="Segments" />

      {/* 3. Business Segments */}
      <ExecutiveSection
        id="business-segments"
        title="Business segments"
        subtitle="Marine is live. Corporate, Retail, and B2B show the future executive vision."
        question="Where is growth concentrated?"
      >
        <ExecutiveGrid columns={4} spacing={DASHBOARD_SPACING.field}>
          {data.segmentCards.map((segment) => (
            <SegmentCard
              key={segment.id}
              icon={SEGMENT_ICONS[segment.id]}
              title={segment.label}
              subtitle={segment.status === 'live' ? 'Live intelligence' : 'Placeholder vision'}
              hoverable={segment.status === 'live'}
              onAction={
                segment.status === 'live'
                  ? () => {
                      document.getElementById('marine-intelligence')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      })
                    }
                  : undefined
              }
              actionLabel={segment.status === 'live' ? 'Open Marine' : undefined}
            >
              <Stack spacing={1.25}>
                <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: -0.4 }}>
                  {segment.revenue}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {segment.applications} · GM {segment.grossMarginPercent} · {segment.growthLabel}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {segment.insight}
                </Typography>
              </Stack>
            </SegmentCard>
          ))}
        </ExecutiveGrid>
        <Box sx={{ mt: DASHBOARD_SPACING.field }}>
          <BusinessSegmentBreakdown
            title="Segment mix"
            subtitle="Share of network volume"
            slices={data.businessSegments}
            loading={loading}
            onRetry={onRetry}
          />
        </Box>
      </ExecutiveSection>

      <SectionDivider label="Revenue" />

      {/* 4. Revenue Intelligence */}
      <ExecutiveSection
        id="revenue-intelligence"
        title="Revenue intelligence"
        subtitle="Country, visa, clients, and growth — rankings over tables."
        question="What is driving revenue?"
      >
        <Stack spacing={DASHBOARD_SPACING.field}>
          <ComparisonLayout
            left={
              <RevenueSnapshot
                data={data.revenueSnapshot}
                loading={loading}
                onRetry={onRetry}
              />
            }
            right={
              <CountryDistribution
                title="Revenue by country"
                slices={data.countryDistribution}
                loading={loading}
                onRetry={onRetry}
              />
            }
          />
          <ComparisonLayout
            left={
              <VisaDistribution
                title="Revenue by visa"
                slices={data.visaDistribution}
                loading={loading}
                onRetry={onRetry}
              />
            }
            right={
              <BranchPerformance
                title="Branch contribution"
                branches={data.branchPerformance}
                loading={loading}
                onRetry={onRetry}
              />
            }
          />
          <ComparisonLayout
            left={
              <RankingList
                title="Top revenue clients"
                subtitle="MTD contribution"
                items={toRankingItems(data.topRevenueClients)}
                loading={loading}
              />
            }
            right={
              <RankingList
                title="Fastest growing clients"
                subtitle="Momentum signals"
                items={toRankingItems(data.fastestGrowingClients)}
                loading={loading}
              />
            }
          />
        </Stack>
      </ExecutiveSection>

      <SectionDivider label="Clients" />

      {/* 5. Client Intelligence */}
      <ExecutiveSection
        id="client-intelligence"
        title="Client intelligence"
        subtitle="Health, margin, dormancy, and opportunity — not a CRM grid."
        question="Which clients need attention?"
      >
        <Stack spacing={DASHBOARD_SPACING.field}>
          <ExecutiveGrid columns={2} spacing={DASHBOARD_SPACING.field}>
            <RankingList
              title="Client health"
              items={toRankingItems(data.clientHealth)}
              loading={loading}
            />
            <RankingList
              title="Outstanding pressure"
              subtitle="Derived from top accounts"
              items={toRankingItems(
                data.clientRows.map((row) => ({
                  id: row.id,
                  primary: row.client,
                  secondary: row.segment,
                  value: row.outstanding,
                  progress: row.status === 'At risk' ? 40 : 75,
                })),
              )}
              loading={loading}
            />
          </ExecutiveGrid>
          <ExecutiveGrid columns={3} spacing={DASHBOARD_SPACING.field}>
            <RankingList
              title="Growth opportunities"
              items={toRankingItems(data.fastestGrowingClients.slice(0, 3))}
              loading={loading}
            />
            <RankingList
              title="High margin clients"
              items={toRankingItems(data.highMarginClients)}
              loading={loading}
            />
            <RankingList
              title="Low margin clients"
              items={toRankingItems(data.lowMarginClients)}
              loading={loading}
            />
          </ExecutiveGrid>
          <ComparisonLayout
            left={
              <RankingList
                title="Dormant clients"
                subtitle="Re-engagement candidates"
                items={toRankingItems(data.dormantClients)}
                loading={loading}
              />
            }
            right={
              <RecentActivity
                title="Client signals"
                items={data.clientActivity}
                loading={loading}
                onRetry={onRetry}
                maxItems={5}
              />
            }
          />
        </Stack>
      </ExecutiveSection>

      <SectionDivider label="Marine" />

      {/* 6. Marine Intelligence — richest section */}
      <ExecutiveSection
        id="marine-intelligence"
        title="Marine intelligence"
        subtitle="Primary vertical — pipeline, crew risk, passport movement, and commercials."
        question="Is Marine delivering safely and profitably?"
        surface="subtle"
      >
        <Stack spacing={DASHBOARD_SPACING.field}>
          <MetricComparison
            title="Marine commercial KPIs"
            metrics={data.marineMetrics}
            loading={loading}
            onRetry={onRetry}
          />
          <ComparisonLayout
            left={
              <OperationsHealth
                title="Marine operations health"
                metrics={data.operationsHealth}
                loading={loading}
                onRetry={onRetry}
              />
            }
            right={
              <ApplicationPipeline
                title="Marine application pipeline"
                stages={data.pipelineStages}
                loading={loading}
                onRetry={onRetry}
                onStageClick={(stageId) => onPipelineStageClick?.(stageId)}
              />
            }
          />
          <MarineTimeline
            title="Joining date & crew risk"
            subtitle="Vessel sign-on pressure — act on red / amber first"
            rows={data.marineTimeline}
            loading={loading}
            onRetry={onRetry}
            onViewAll={() => onNavigate('/admin/application-management/marine')}
          />
          <ComparisonLayout
            left={
              <PassportJourney
                title="Passport journey"
                stages={data.passportJourney.stages}
                journeyStatus={data.passportJourney.journeyStatus}
                eta={data.passportJourney.eta}
                trackingNumber={data.passportJourney.trackingNumber}
                courier={data.passportJourney.courier}
                loading={loading}
                onRetry={onRetry}
              />
            }
            right={
              <RiskOverview
                title="Marine & embassy alerts"
                alerts={data.riskAlerts}
                loading={loading}
                onRetry={onRetry}
                onShowMore={() => onNavigate('/admin/application-management/marine')}
              />
            }
          />
          <ComparisonLayout
            left={
              <CollectionSummary
                title="Marine collections"
                data={data.collectionSummary}
                loading={loading}
                onRetry={onRetry}
              />
            }
            right={
              <RecentActivity
                title="Marine activity"
                items={data.recentActivity}
                loading={loading}
                onRetry={onRetry}
                maxItems={5}
              />
            }
          />
        </Stack>
      </ExecutiveSection>

      <SectionDivider label="Finance" />

      {/* 7. Finance */}
      <ExecutiveSection
        id="finance"
        title="Finance"
        subtitle="Collections, ageing, cash pressure, and forecast signals."
        question="Where is cash and credit exposure?"
      >
        <Stack spacing={DASHBOARD_SPACING.field}>
          <ComparisonLayout
            left={
              <CollectionSummary
                data={data.collectionSummary}
                loading={loading}
                onRetry={onRetry}
              />
            }
            right={
              <MetricComparison
                title="Working capital signals"
                metrics={data.financeMetricComparison}
                loading={loading}
                onRetry={onRetry}
              />
            }
          />
          <AgeingAnalysis
            title="Receivables ageing"
            buckets={data.ageingBuckets}
            loading={loading}
            onRetry={onRetry}
          />
          <ExecutiveGrid columns={3} spacing={DASHBOARD_SPACING.field}>
            <HighlightCard
              title="Cash position"
              subtitle="Mock executive signal"
              highlight="₹2.04Cr"
              highlightLabel="Available liquidity"
            >
              <Typography variant="caption" color="text.secondary">
                Collections cadence improving; 90+ bucket still the primary drag.
              </Typography>
            </HighlightCard>
            <HighlightCard
              title="Credit exposure"
              subtitle="Concentration risk"
              highlight="41%"
              highlightLabel="Overdue in top 3 accounts"
            >
              <Typography variant="caption" color="text.secondary">
                Nordic Marine and two corporate accounts drive overdue AR.
              </Typography>
            </HighlightCard>
            <HighlightCard
              title="Revenue forecast"
              subtitle="Next 30 days"
              highlight="₹2.35Cr"
              highlightLabel="Projected MTD exit"
            >
              <Typography variant="caption" color="text.secondary">
                Assumes Marine sign-ons clear and Schengen lag does not widen.
              </Typography>
            </HighlightCard>
          </ExecutiveGrid>
          <ProcessingTrend
            title="Collections vs billed"
            subtitle="Weekly rhythm"
            points={data.processingTrend}
            secondaryLabel="Collected"
            loading={loading}
            onRetry={onRetry}
          />
          {forecasts.length > 0 ? (
            <PredictivePanel
              title="Forward outlook"
              subtitle="Revenue · collections · pipeline · capacity"
              models={forecasts}
              loading={loading}
            />
          ) : null}
        </Stack>
      </ExecutiveSection>

      <SectionDivider label="Operations" />

      {/* 8. Operations */}
      <ExecutiveSection
        id="operations"
        title="Operations"
        subtitle="Applications, embassy pressure, SLA, and country performance."
        question="Where is delivery at risk?"
      >
        <Stack spacing={DASHBOARD_SPACING.field}>
          <ComparisonLayout
            left={
              <OperationsHealth
                metrics={data.operationsHealth}
                loading={loading}
                onRetry={onRetry}
              />
            }
            right={
              <ApplicationPipeline
                stages={data.pipelineStages}
                loading={loading}
                onRetry={onRetry}
                onStageClick={(stageId) => onPipelineStageClick?.(stageId)}
              />
            }
          />
          <ComparisonLayout
            left={
              <SLAOverview
                title="SLA overview"
                items={data.slaOverview}
                loading={loading}
                onRetry={onRetry}
              />
            }
            right={
              <CountryDistribution
                title="Country performance"
                slices={data.countryDistribution}
                loading={loading}
                onRetry={onRetry}
              />
            }
          />
          <ProcessingTrend
            title="Processing trend"
            subtitle="Volume and completions"
            points={data.processingTrend}
            secondaryLabel="Completed"
            loading={loading}
            onRetry={onRetry}
          />
        </Stack>
      </ExecutiveSection>

      <SectionDivider label="Sales" />

      {/* 9. Sales — placeholder for non-marine */}
      <ExecutiveSection
        id="sales"
        title="Sales"
        subtitle="Pipeline vision for Corporate, Retail, and B2B — placeholder until CRM depth lands."
        question="What should commercial leadership watch?"
      >
        <Stack spacing={DASHBOARD_SPACING.field}>
          <QuickStats
            title="Commercial snapshot (placeholder)"
            columns={4}
            loading={loading}
            items={[
              {
                id: 'pipe',
                label: 'Pipeline value',
                value: data.salesPlaceholder.pipelineValue,
              },
              {
                id: 'win',
                label: 'Win rate',
                value: data.salesPlaceholder.winRate,
              },
              {
                id: 'deal',
                label: 'Average deal',
                value: data.salesPlaceholder.avgDeal,
              },
              {
                id: 'conv',
                label: 'Proposal conversion',
                value: data.salesPlaceholder.conversion,
              },
            ]}
          />
          <ExecutiveGrid columns={3} spacing={DASHBOARD_SPACING.field}>
            {data.salesPlaceholder.notes.map((note, index) => (
              <InsightCard key={note} accent={index === 0 ? 'info' : 'neutral'} title="Vision note">
                <Typography variant="body2" color="text.secondary">
                  {note}
                </Typography>
              </InsightCard>
            ))}
          </ExecutiveGrid>
        </Stack>
      </ExecutiveSection>

      <SectionDivider label="Alerts" />

      {/* 10. Management Alerts */}
      <ExecutiveSection
        id="management-alerts"
        title="Management alerts"
        subtitle="Ranked by financial impact, severity, and business risk — not a notification feed."
        question="Where should leadership act today?"
      >
        <Stack spacing={DASHBOARD_SPACING.field}>
          {managementAlerts && managementAlerts.length > 0 ? (
            <ManagementAlertCenter
              alerts={managementAlerts}
              loading={loading}
              defaultSort="severity"
            />
          ) : (
            <AlertPanel
              title="Executive alert center"
              subtitle="Critical · High · Medium · Low"
              loading={loading}
              maxItems={8}
              items={data.managementAlerts.map((alert) => ({
                id: alert.id,
                primary: alert.title,
                secondary: alert.description,
                badgeLabel: alertBadge(alert.severity),
                badgeTone: alertTone(alert.severity),
              }))}
            />
          )}
          {recommendations.length > 0 ? (
            <IntelligenceRecommendationPanel items={recommendations} />
          ) : null}
          {insights.length > 2 ? (
            <ExecutiveGrid columns={2}>
              {insights.slice(2).map((insight) => (
                <ExecutiveInsightCard key={insight.id} insight={insight} />
              ))}
            </ExecutiveGrid>
          ) : null}
        </Stack>
      </ExecutiveSection>

      <SectionDivider label="People" />

      {/* 11. Staff Productivity */}
      <ExecutiveSection
        id="staff-productivity"
        title="Staff productivity"
        subtitle="Throughput, utilization, and departmental leaderboard."
        question="Is the operating team delivering?"
      >
        <Stack spacing={DASHBOARD_SPACING.field}>
          <ExecutiveGrid columns={4} spacing={DASHBOARD_SPACING.field}>
            {data.staffProductivity.map((item) => (
              <ProgressMetric
                key={item.id}
                label={item.label}
                value={item.value}
                helperText={item.helperText}
                loading={loading}
              />
            ))}
          </ExecutiveGrid>
          <ComparisonLayout
            left={
              <RankingList
                title="Department leaderboard"
                subtitle="Completion and SLA"
                items={toRankingItems(data.staffLeaderboard)}
                loading={loading}
              />
            }
            right={
              <TeamCapacity
                title="Queue vs capacity"
                rows={data.teamCapacity}
                loading={loading}
                onRetry={onRetry}
                onViewAll={() => onNavigate('/admin/access/teams')}
              />
            }
          />
        </Stack>
      </ExecutiveSection>

      <SectionDivider label="Actions" />

      {/* 12. Quick Actions — bottom only */}
      <ExecutiveSection
        id="quick-actions"
        title="Quick actions"
        subtitle="Minimal leadership shortcuts."
      >
        <QuickActions
          variant="tiles"
          columns={3}
          loading={loading}
          items={data.quickActions.slice(0, 6).map((action) => ({
            id: action.id,
            title: action.title,
            description: action.description,
            badge: action.badge,
            icon: ACTION_ICONS[action.id] ?? <LayoutDashboard size={18} />,
            onClick: () => onNavigate(action.href),
          }))}
        />
      </ExecutiveSection>
    </InsightStack>
  )
}
