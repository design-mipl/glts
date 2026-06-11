import { useMemo, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BaseCard, EmptyState, Tabs } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import type { BusinessSegment } from '@/shared/types/countryMaster'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import { CountryDetailSummary } from '../components/CountryDetailSummary'
import { ActivityTimelineTab } from '../components/detail/ActivityTimelineTab'
import { ChecklistTab } from '../components/detail/ChecklistTab'
import { OverviewTab } from '../components/detail/OverviewTab'
import { ProcessingRulesTab } from '../components/detail/ProcessingRulesTab'
import { VisaTypesTab } from '../components/detail/VisaTypesTab'
import {
  COUNTRY_DETAIL_TABS,
  parseDetailTabParam,
  parseSegmentParam,
  type CountryDetailTab,
} from '../config/countrySegmentConfig'
import { useCountryDetailState } from '../hooks/useCountryDetailState'

export function CountryDetailPage() {
  const { countryId } = useParams<{ countryId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loading, country } = useCountryDetailState(countryId)

  const enabledSegments = useMemo(
    () => (country ? countryMasterAdminService.getEnabledSegments(country) : []),
    [country],
  )

  const segmentParam = parseSegmentParam(searchParams.get('segment'))
  const activeSegment: BusinessSegment =
    segmentParam && enabledSegments.includes(segmentParam)
      ? segmentParam
      : enabledSegments[0] ?? 'retail'

  const activeTab = parseDetailTabParam(searchParams.get('tab'))
  const [tabState, setTabState] = useState<CountryDetailTab>(activeTab)

  const setSegment = (segment: BusinessSegment) => {
    const next = new URLSearchParams(searchParams)
    next.set('segment', segment)
    setSearchParams(next, { replace: true })
  }

  const setTab = (tab: CountryDetailTab) => {
    setTabState(tab)
    const next = new URLSearchParams(searchParams)
    next.set('tab', tab)
    setSearchParams(next, { replace: true })
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!country) {
    return (
      <EmptyState
        variant="no-data"
        title="Country not found"
        action={{
          label: 'Back to Country Master',
          onClick: () => navigate('/admin/masters/country'),
        }}
      />
    )
  }

  const tabs = COUNTRY_DETAIL_TABS.map((t) => ({
    value: t.value,
    label: t.label,
    badge: t.value === 'activity' ? country.activities.length : undefined,
  }))

  return (
    <AdminDetailShell
      breadcrumbs={[
        { label: 'Country Master', href: '/admin/masters/country' },
        { label: country.name },
      ]}
      summary={
        <CountryDetailSummary
          country={country}
          activeSegment={activeSegment}
          onSegmentChange={setSegment}
        />
      }
    >
      <BaseCard>
        <Box sx={{ px: 2.5, pt: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabState}
            onChange={(v) => setTab(v as CountryDetailTab)}
            variant="underline"
            size="sm"
            items={tabs}
          />
        </Box>
        <Box sx={{ p: 2.5 }}>
          {tabState === 'overview' ? (
            <OverviewTab country={country} segment={activeSegment} />
          ) : null}
          {tabState === 'visa-types' ? (
            <VisaTypesTab country={country} segment={activeSegment} />
          ) : null}
          {tabState === 'checklist' ? (
            <ChecklistTab country={country} segment={activeSegment} />
          ) : null}
          {tabState === 'processing-rules' ? (
            <ProcessingRulesTab country={country} segment={activeSegment} />
          ) : null}
          {tabState === 'activity' ? <ActivityTimelineTab country={country} /> : null}
        </Box>
      </BaseCard>
    </AdminDetailShell>
  )
}
