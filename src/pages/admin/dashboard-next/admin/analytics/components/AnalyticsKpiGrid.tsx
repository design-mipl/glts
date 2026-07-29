import { Box, Stack, Typography, alpha, useTheme } from '@mui/material'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { useDrilldownOptional } from '../../../shared/dashboard-intelligence'
import { ExecutiveGrid } from '../../../shared/dashboard-ui-kit'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import type { VisaAnalyticsKpi } from '../types'

export function AnalyticsKpiGrid({
  items,
  columns = 4,
}: {
  items: VisaAnalyticsKpi[]
  columns?: 2 | 3 | 4
}) {
  const colors = usePublicBrandColors()
  const theme = useTheme()
  const drilldown = useDrilldownOptional()

  return (
    <ExecutiveGrid columns={columns} spacing={1.25}>
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
              p: 1.75,
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
              sx={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.3 }}
            >
              {kpi.label}
            </Typography>
            <Typography
              sx={{
                mt: 0.75,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {kpi.value}
            </Typography>
            {kpi.delta != null ? (
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.75 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.35,
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 999,
                    bgcolor: alpha(tone, 0.12),
                    color: tone,
                  }}
                >
                  {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <Typography component="span" sx={{ fontSize: 11, fontWeight: 700 }}>
                    {up ? '+' : ''}
                    {kpi.delta}%
                  </Typography>
                </Box>
                {kpi.deltaLabel ? (
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
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
