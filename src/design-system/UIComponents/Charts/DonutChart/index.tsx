import { Skeleton } from '@mui/material'
import {
  PieChart as RechartsPieChart,
  Pie, Cell, Tooltip, Legend, ResponsiveContainer, usePlotArea,
} from 'recharts'
import { useChartTheme } from '../utils/chartTheme'

export interface DonutSlice {
  key: string
  label: string
  value: number
  color?: string
}

export interface DonutChartProps {
  data: DonutSlice[]
  height?: number
  showLegend?: boolean
  /** `bottom` = horizontal wrap (typically ~2 lines); `auto` uses chart theme. */
  legendPlacement?: 'auto' | 'bottom'
  showTooltip?: boolean
  loading?: boolean
  centerValue?: string
  centerLabel?: string
  formatTooltip?: (value: any) => string
}

/**
 * Center label using plot-area center (legend-aware), matching Pie's cx/cy math.
 * Recharts polar Label viewBox uses full SVG size and ignores legend offset.
 */
function DonutCenterLabel({
  centerValue,
  centerLabel,
  fontFamily,
  valueColor,
  labelColor,
}: {
  centerValue?: string
  centerLabel?: string
  fontFamily: string
  valueColor: string
  labelColor: string
}) {
  const plotArea = usePlotArea()
  if (!plotArea || (!centerValue && !centerLabel)) return null

  const cx = plotArea.x + plotArea.width / 2
  const cy = plotArea.y + plotArea.height / 2
  const hasBoth = Boolean(centerValue && centerLabel)

  return (
    <text textAnchor="middle" dominantBaseline="central" style={{ pointerEvents: 'none' }}>
      {centerValue ? (
        <tspan
          x={cx}
          y={hasBoth ? cy - 8 : cy}
          fill={valueColor}
          fontSize={20}
          fontWeight={700}
          fontFamily={fontFamily}
        >
          {centerValue}
        </tspan>
      ) : null}
      {centerLabel ? (
        <tspan
          x={cx}
          y={hasBoth ? cy + 12 : cy}
          fill={labelColor}
          fontSize={12}
          fontFamily={fontFamily}
        >
          {centerLabel}
        </tspan>
      ) : null}
    </text>
  )
}

export default function DonutChart({
  data,
  height = 300,
  showLegend = true,
  legendPlacement = 'auto',
  showTooltip = true,
  loading = false,
  centerValue,
  centerLabel,
  formatTooltip,
}: DonutChartProps) {
  const ct = useChartTheme()
  const h = ct.isMobile ? Math.round(height * 0.75) : height
  const outerRadius = Math.round((h / 2) * 0.8)
  const innerRadius = Math.round(outerRadius * 0.55)

  const legendProps =
    legendPlacement === 'bottom'
      ? {
          layout: 'horizontal' as const,
          verticalAlign: 'bottom' as const,
          align: 'center' as const,
          wrapperStyle: {
            ...ct.legendProps.wrapperStyle,
            width: '100%',
            paddingLeft: 0,
            paddingTop: 8,
            lineHeight: '18px',
          },
        }
      : ct.legendProps

  if (loading) return <Skeleton variant="rectangular" width="100%" height={h} sx={{ borderRadius: 1 }} />

  return (
    <ResponsiveContainer width="100%" height={h}>
      <RechartsPieChart>
        {showTooltip && (
          <Tooltip
            contentStyle={ct.tooltipStyle}
            labelStyle={{ color: ct.theme.palette.text.secondary, fontSize: 11, marginBottom: 4 }}
            itemStyle={{ color: ct.theme.palette.text.primary, fontSize: 12 }}
            formatter={formatTooltip as any}
          />
        )}
        {showLegend && <Legend {...legendProps} />}
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          paddingAngle={2}
          cornerRadius={4}
          animationDuration={800}
        >
          {data.map((slice, i) => (
            <Cell
              key={slice.key}
              fill={slice.color ?? ct.colors[i % ct.colors.length]}
            />
          ))}
        </Pie>
        {(centerValue || centerLabel) && (
          <DonutCenterLabel
            centerValue={centerValue}
            centerLabel={centerLabel}
            fontFamily={ct.fontFamily}
            valueColor={ct.theme.palette.text.primary}
            labelColor={ct.theme.palette.text.secondary}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
