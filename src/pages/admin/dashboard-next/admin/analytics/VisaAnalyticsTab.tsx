import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Tabs } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { DASHBOARD_SPACING } from '../../shared'
import {
  VISA_ANALYTICS_SECTION_TABS,
  type VisaAnalyticsSectionId,
} from './config/visaAnalyticsConfig'
import { VISA_ANALYTICS_MOCK } from './data/visaAnalyticsMock'
import {
  CollectionSection,
  DispatchSection,
  PanIndiaSection,
  SubmissionSection,
  VolumeSection,
} from './sections/PrimarySections'
import {
  ApprovalSection,
  RankingsSection,
  RefusalSection,
  RevenueSection,
  SlaSection,
} from './sections/QualitySections'

export interface VisaAnalyticsTabProps {
  loading?: boolean
}

/** Executive Visa Analytics workspace — sectioned BI charts and rankings. */
export function VisaAnalyticsTab({ loading = false }: VisaAnalyticsTabProps) {
  const colors = usePublicBrandColors()
  const [section, setSection] = useState<VisaAnalyticsSectionId>('volume')
  const data = VISA_ANALYTICS_MOCK

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1.25 }}>
        <ExecutiveSectionHeader
          title="Visa Analytics"
          description="Executive business intelligence across volumes, submissions, collections, dispatches, refusals, approvals, SLA, rankings, and revenue."
        />
      </Box>

      <Box
        sx={{
          px: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          overflowX: 'auto',
        }}
      >
        <Tabs
          value={section}
          onChange={(value) => setSection(value as VisaAnalyticsSectionId)}
          variant="underline"
          size="sm"
          items={VISA_ANALYTICS_SECTION_TABS.map((tab) => ({
            value: tab.value,
            label: tab.label,
          }))}
        />
      </Box>

      <Box sx={{ p: 2 }}>
        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Loading visa analytics…
          </Typography>
        ) : (
          <Stack spacing={DASHBOARD_SPACING.field}>
            {section === 'volume' ? <VolumeSection data={data} /> : null}
            {section === 'submission' ? <SubmissionSection data={data} /> : null}
            {section === 'collection' ? <CollectionSection data={data} /> : null}
            {section === 'dispatch' ? <DispatchSection data={data} /> : null}
            {section === 'pan-india' ? <PanIndiaSection data={data} /> : null}
            {section === 'refusal' ? <RefusalSection data={data} /> : null}
            {section === 'approval' ? <ApprovalSection data={data} /> : null}
            {section === 'sla' ? <SlaSection data={data} /> : null}
            {section === 'rankings' ? <RankingsSection data={data} /> : null}
            {section === 'revenue' ? <RevenueSection data={data} /> : null}
          </Stack>
        )}
      </Box>
    </Box>
  )
}
