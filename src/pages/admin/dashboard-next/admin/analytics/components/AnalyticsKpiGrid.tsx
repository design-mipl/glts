import { Box, Stack, Typography, alpha, useTheme } from '@mui/material'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { useDrilldownOptional } from '../../../shared/dashboard-intelligence'
import { ExecutiveGrid } from '../../../shared/dashboard-ui-kit'
import { kpiColumns, type KpiColumnCount } from '../../../shared/utils/kpiColumns'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import type { VisaAnalyticsKpi } from '../types'

export function AnalyticsKpiGrid({
  items,
  columns,
}: {
  items: VisaAnalyticsKpi[]
  /** Override auto columns (defaults to matching item count, max 6). */
  columns?: KpiColumnCount
}) {
  const colors = usePublicBrandColors()
  const theme = useTheme()
  const drilldown = useDrilldownOptional()
  const resolvedColumns = columns ?? kpiColumns(items.length)

  return (
    <ExecutiveGrid columns={resolvedColumns} spacing={1}>
      {items.map((kpi) => {
        const up = (kpi.delta ?? 0) >= 0
        const tone =
          kpi.delta == null
            ? theme.palette.text.secondary
            : up
              ? theme.palette.success.main
              : theme.palette.error.main

        return (
          <Box
            key={kpi.id}
            role={drilldown ? 'button' : undefined}
            tabIndex={drilldown ? 0 : undefined}
            aria-label={`${kpi.label}: ${kpi.value}`}
            onClick={() =>
              drilldown?.openDrilldown({
                id: `visa-kpi-${kpi.id}`,
                title: kpi.label,
                subtitle: 'Visa Analytics KPI',
                entityType: 'kpi',
                entityId: kpi.id,
                surface: 'dialog',
                meta: { value: kpi.value, delta: kpi.delta, deltaLabel: kpi.deltaLabel },
              })
            }
            onKeyDown={(event) => {
              if (!drilldown) return
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                drilldown.openDrilldown({
                  id: `visa-kpi-${kpi.id}`,
                  title: kpi.label,
                  subtitle: 'Visa Analytics KPI',
                  entityType: 'kpi',
                  entityId: kpi.id,
                  surface: 'dialog',
                  meta: { value: kpi.value, delta: kpi.delta },
                })
              }
            }}
            sx={{
              ...executiveCardLevel2Sx(colors),
              p: 1.25,
              cursor: drilldown ? 'pointer' : 'default',
              transition: 'box-shadow 160ms ease, transform 160ms ease',
              '&:hover': drilldown
                ? { boxShadow: theme.shadows[3], transform: 'translateY(-1px)' }
                : undefined,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              sx={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.3 }}
            >
              {kpi.label}
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              {kpi.value}
            </Typography>
            {kpi.delta != null ? (
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.25,
                    px: 0.5,
                    py: 0.15,
                    borderRadius: 999,
                    bgcolor: alpha(tone, 0.12),
                    color: tone,
                  }}
                >
                  {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  <Typography component="span" sx={{ fontSize: 10, fontWeight: 700 }}>
                    {up ? '+' : ''}
                    {kpi.delta}%
                  </Typography>
                </Box>
                {kpi.deltaLabel ? (
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                    {kpi.deltaLabel}
                  </Typography>
                ) : null}
              </Stack>
            ) : null}
          </Box>
        )
      })}
    </ExecutiveGrid>
  )
}
