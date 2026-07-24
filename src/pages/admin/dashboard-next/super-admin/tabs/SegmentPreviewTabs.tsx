import { Alert, Stack, Typography } from '@mui/material'
import { MetricComparison, DASHBOARD_SPACING } from '../../shared'
import { ComparisonLayout, RankingList } from '../../shared/dashboard-ui-kit'
import type {
  SuperAdminDashboardTabProps,
  SuperAdminRankItem,
  SuperAdminVerticalPreview,
} from '../types'

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

function PreviewBanner({ vertical }: { vertical: string }) {
  return (
    <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
      <Typography variant="body2" fontWeight={600}>
        {vertical} preview — sample data
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Layout mirrors Marine. Live metrics land when the {vertical} application flow matches Marine.
      </Typography>
    </Alert>
  )
}

function VerticalPreviewBody({
  preview,
  loading,
  entityTitle,
  countryTitle,
  pendingTitle,
  clientsTitle,
}: {
  preview: SuperAdminVerticalPreview
  loading?: boolean
  entityTitle: string
  countryTitle: string
  pendingTitle: string
  clientsTitle: string
}) {
  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <MetricComparison title="Commercial KPIs" metrics={preview.kpis} loading={loading} />
      <ComparisonLayout
        left={
          <RankingList
            title={entityTitle}
            items={toRankingItems(preview.byEntity)}
            loading={loading}
          />
        }
        right={
          <RankingList
            title={countryTitle}
            items={toRankingItems(preview.byCountry)}
            loading={loading}
          />
        }
      />
      <ComparisonLayout
        left={
          <RankingList
            title={pendingTitle}
            items={toRankingItems(preview.pending)}
            loading={loading}
          />
        }
        right={
          <RankingList
            title={clientsTitle}
            items={toRankingItems(preview.topClients)}
            loading={loading}
          />
        }
      />
      {preview.notes.map((note) => (
        <Typography key={note} variant="caption" color="text.secondary">
          {note}
        </Typography>
      ))}
    </Stack>
  )
}

export function CorporateTab({ data, loading }: SuperAdminDashboardTabProps) {
  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <PreviewBanner vertical="Corporate" />
      <VerticalPreviewBody
        preview={data.corporatePreview}
        loading={loading}
        entityTitle="Applications by company"
        countryTitle="Applications by country"
        pendingTitle="Pending business visas"
        clientsTitle="Top corporate clients"
      />
    </Stack>
  )
}

export function RetailTab({ data, loading }: SuperAdminDashboardTabProps) {
  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <PreviewBanner vertical="Retail" />
      <VerticalPreviewBody
        preview={data.retailPreview}
        loading={loading}
        entityTitle="Walk-in · online · branch mix"
        countryTitle="Top destinations"
        pendingTitle="Payment status & ratings"
        clientsTitle="Destination revenue"
      />
    </Stack>
  )
}

export function B2bTab({ data, loading }: SuperAdminDashboardTabProps) {
  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <PreviewBanner vertical="B2B" />
      <VerticalPreviewBody
        preview={data.b2bPreview}
        loading={loading}
        entityTitle="Applications by travel partner"
        countryTitle="Applications by country"
        pendingTitle="Partner signals"
        clientsTitle="Most active agencies"
      />
    </Stack>
  )
}
