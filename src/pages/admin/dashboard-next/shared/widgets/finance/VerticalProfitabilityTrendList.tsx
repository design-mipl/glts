import type { ReactNode } from 'react'
import { Box, Stack, Typography, alpha, useTheme } from '@mui/material'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Badge, SparkLine } from '@/design-system/UIComponents'
import { ChartPanel } from '../ChartPanel'
import { computeMarginTrendSignal } from '../../utils/managementFinanceSelectors'
import type { VerticalMarginRow } from '../../types'

const ROW_HEIGHT = 34
const SPARK_HEIGHT = 24

const GRID_COLUMNS = 'minmax(76px, 1.1fr) 52px 72px 76px minmax(80px, 1fr)'

function TrendPill({
  label,
  tone,
}: {
  label: string
  tone: 'positive' | 'negative' | 'neutral'
}) {
  return (
    <Badge
      label={label}
      size="sm"
      color={tone === 'positive' ? 'success' : tone === 'negative' ? 'error' : 'neutral'}
      variant="soft"
    />
  )
}

function VerticalProfitabilityRow({
  row,
  rank,
  maxMargin,
}: {
  row: VerticalMarginRow
  rank: number
  maxMargin: number
}) {
  const theme = useTheme()
  const { direction, deltaPp } = computeMarginTrendSignal(row.marginTrend6M)
  const momUp = row.trendDelta >= 0
  const momTone = momUp ? 'positive' : 'negative'
  const trendTone =
    direction === 'improving' ? 'positive' : direction === 'declining' ? 'negative' : 'neutral'
  const accentColor =
    direction === 'improving'
      ? theme.palette.success.main
      : direction === 'declining'
        ? theme.palette.error.main
        : theme.palette.divider
  const barWidth = maxMargin > 0 ? Math.round((row.marginPercent / maxMargin) * 100) : 0

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: GRID_COLUMNS,
        alignItems: 'center',
        columnGap: 1,
        minHeight: ROW_HEIGHT,
        px: 1,
        py: 0.5,
        borderRadius: '8px',
        borderLeft: `3px solid ${accentColor}`,
        bgcolor: alpha(theme.palette.background.default, 0.45),
        transition: 'background-color 140ms ease',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.04),
        },
      }}
    >
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={700}
          sx={{ fontSize: 10, width: 14, flexShrink: 0 }}
        >
          {rank}
        </Typography>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12, lineHeight: 1.2 }} noWrap>
            {row.label}
          </Typography>
          <Box
            sx={{
              mt: 0.35,
              height: 3,
              borderRadius: 999,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: `${barWidth}%`,
                height: '100%',
                borderRadius: 999,
                bgcolor: alpha(theme.palette.primary.main, 0.55),
              }}
            />
          </Box>
        </Box>
      </Stack>

      <Typography fontWeight={800} sx={{ fontSize: 13, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {row.marginPercent}%
      </Typography>

      <Box sx={{ justifySelf: 'start' }}>
        <TrendPill
          label={`${momUp ? '↑' : '↓'} ${Math.abs(row.trendDelta)}pp`}
          tone={momTone}
        />
      </Box>

      <Box sx={{ justifySelf: 'start' }}>
        <TrendPill
          label={
            direction === 'improving'
              ? `↑ ${Math.abs(deltaPp)}pp`
              : direction === 'declining'
                ? `↓ ${Math.abs(deltaPp)}pp`
                : 'Flat'
          }
          tone={trendTone}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          minWidth: 0,
          px: 0.5,
          py: 0.25,
          borderRadius: '6px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        {direction === 'improving' ? (
          <TrendingUp size={12} color={theme.palette.success.main} />
        ) : direction === 'declining' ? (
          <TrendingDown size={12} color={theme.palette.error.main} />
        ) : null}
        <Box sx={{ flex: 1, minWidth: 48, height: SPARK_HEIGHT }}>
          <SparkLine
            data={row.marginTrend6M}
            height={SPARK_HEIGHT}
            positive={direction === 'improving' ? true : direction === 'declining' ? false : undefined}
            showTooltip
          />
        </Box>
      </Box>
    </Box>
  )
}

function ColumnHeader({ children, align = 'left' }: { children: ReactNode; align?: 'left' | 'right' }) {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      fontWeight={700}
      sx={{
        fontSize: 10,
        letterSpacing: 0.35,
        textTransform: 'uppercase',
        textAlign: align,
      }}
    >
      {children}
    </Typography>
  )
}

export interface VerticalProfitabilityTrendListProps {
  rows: VerticalMarginRow[]
  loading?: boolean
}

/** Six-month gross margin % per vertical — ranked list with trend pills and sparklines. */
export function VerticalProfitabilityTrendList({ rows, loading }: VerticalProfitabilityTrendListProps) {
  const theme = useTheme()
  const sorted = [...rows].sort((a, b) => b.marginPercent - a.marginPercent)
  const maxMargin = sorted[0]?.marginPercent ?? 100
  const contentHeight = sorted.length * (ROW_HEIGHT + 4) + 28
  const heightSpacing = Math.max(10, Math.ceil(contentHeight / 8))

  return (
    <ChartPanel
      title="Vertical profitability"
      subtitle="6-month gross margin trend by segment"
      loading={loading}
      heightSpacing={heightSpacing}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: GRID_COLUMNS,
          alignItems: 'center',
          columnGap: 1,
          px: 1,
          py: 0.5,
          mb: 0.5,
          borderRadius: '6px',
          bgcolor: alpha(theme.palette.text.primary, 0.03),
        }}
      >
        <ColumnHeader>Vertical</ColumnHeader>
        <ColumnHeader align="right">Margin</ColumnHeader>
        <ColumnHeader>MoM</ColumnHeader>
        <ColumnHeader>6M</ColumnHeader>
        <ColumnHeader>Sparkline</ColumnHeader>
      </Box>

      <Stack spacing={0.5}>
        {sorted.map((row, index) => (
          <VerticalProfitabilityRow key={row.id} row={row} rank={index + 1} maxMargin={maxMargin} />
        ))}
      </Stack>
    </ChartPanel>
  )
}
