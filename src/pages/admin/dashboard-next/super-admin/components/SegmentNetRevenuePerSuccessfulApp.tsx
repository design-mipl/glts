import { useMemo } from 'react'
import { Box, Divider, Grid, Skeleton, Stack, Typography } from '@mui/material'
import { BarChart } from '@/design-system/UIComponents'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  SA_CHART_HEIGHT_DENSE,
  TopNSelect,
  sliceTopN,
  useTopN,
} from './SuperAdminChrome'
import type { SuperAdminDestinationMixItem } from '../types'

function formatRupee(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`
}

export interface SegmentNetRevenuePerSuccessfulAppProps {
  items: SuperAdminDestinationMixItem[]
  loading?: boolean
}

/**
 * Net revenue ÷ successful applications by destination.
 * Ranked values (left) + horizontal bar chart (right). Top 5–25 filter only.
 */
export function SegmentNetRevenuePerSuccessfulApp({
  items,
  loading,
}: SegmentNetRevenuePerSuccessfulAppProps) {
  const colors = usePublicBrandColors()
  const top = useTopN('10')

  const rows = useMemo(
    () =>
      sliceTopN(
        [...items].sort(
          (a, b) => b.netRevenuePerSuccessfulApp - a.netRevenuePerSuccessfulApp,
        ),
        top.topN,
      ),
    [items, top.topN],
  )

  const chartData = useMemo(
    () =>
      rows.map((row) => ({
        destination: row.label,
        value: row.netRevenuePerSuccessfulApp,
      })),
    [rows],
  )

  const chartHeight = Math.max(SA_CHART_HEIGHT_DENSE, 32 * Math.max(rows.length, 3))

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={1.25}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <ExecutiveSectionHeader
              title="Revenue per Successful Application"
              description="Net revenue after rejection and refund costs, divided by successful applications only."
            />
          </Box>
          <TopNSelect
            value={top.topN}
            onChange={top.setTopN}
            ariaLabel="Revenue per successful application top N"
          />
        </Stack>
      </Box>

      {loading ? (
        <Box sx={{ px: 2, pb: 2 }}>
          <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 1 }} />
        </Box>
      ) : rows.length === 0 ? (
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, py: 1 }}>
            No destination data for this segment.
          </Typography>
        </Box>
      ) : (
        <Grid
          container
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Grid
            size={{ xs: 12, md: 5 }}
            sx={{
              px: 2,
              py: 1.5,
              borderRight: { md: '1px solid' },
              borderColor: { md: 'divider' },
            }}
          >
            <Stack spacing={0.75} divider={<Divider flexItem />}>
              {rows.map((row) => (
                <Stack
                  key={row.id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                  sx={{ py: 0.75 }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ fontSize: 13, minWidth: 0 }}
                    noWrap
                  >
                    {row.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}
                  >
                    {formatRupee(row.netRevenuePerSuccessfulApp)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }} sx={{ px: 2, py: 1.5 }}>
            <BarChart
              data={chartData}
              xKey="destination"
              orientation="horizontal"
              height={chartHeight}
              barSize={14}
              showLegend={false}
              formatX={(value) => formatRupee(Number(value))}
              bars={[{ key: 'value', label: 'Revenue per successful application' }]}
              tooltipExtras={[
                {
                  key: 'value',
                  label: 'Per successful app',
                  format: (v) => formatRupee(Number(v)),
                },
              ]}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
