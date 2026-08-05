import { Skeleton } from '@mui/material'
import {
  BarChart as RechartsBarChart,
  Bar, XAxis, YAxis, CartesianGrid, Cell,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { useChartTheme } from '../utils/chartTheme'

export interface BarConfig {
  key: string
  label: string
  color?: string
}

export interface BarChartProps {
  data: Record<string, any>[]
  bars: BarConfig[]
  xKey: string
  height?: number
  orientation?: 'vertical' | 'horizontal'
  stacked?: boolean
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  loading?: boolean
  formatX?: (value: any) => string
  formatY?: (value: any) => string
  /** Split long category labels onto two lines (space near mid). Best with horizontal bars. */
  wrapCategoryLabels?: boolean
  barSize?: number
}

/** Split "Reliance Industries" → ["Reliance", "Industries"] at the space nearest mid. */
export function splitLabelTwoLines(label: string): string[] {
  const trimmed = label.trim()
  if (!trimmed) return ['']
  if (!trimmed.includes(' ') || trimmed.length <= 10) return [trimmed]

  const mid = Math.ceil(trimmed.length / 2)
  let best = -1
  let bestDist = Infinity
  for (let i = 0; i < trimmed.length; i += 1) {
    if (trimmed[i] !== ' ') continue
    const dist = Math.abs(i - mid)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  }
  if (best <= 0) return [trimmed]
  return [trimmed.slice(0, best).trim(), trimmed.slice(best + 1).trim()].filter(Boolean)
}

function TwoLineCategoryTick({
  x = 0,
  y = 0,
  payload,
  fill,
  fontSize = 11,
  textAnchor = 'end',
  formatter,
}: {
  x?: number
  y?: number
  payload?: { value?: string | number }
  fill?: string
  fontSize?: number | string
  textAnchor?: 'inherit' | 'end' | 'start' | 'middle'
  formatter?: (value: unknown) => string
}) {
  const raw = payload?.value
  const label = formatter ? formatter(raw) : String(raw ?? '')
  const lines = splitLabelTwoLines(label)

  if (lines.length === 1) {
    return (
      <text x={x} y={y} fill={fill} fontSize={fontSize} textAnchor={textAnchor} dominantBaseline="middle">
        {lines[0]}
      </text>
    )
  }

  return (
    <text x={x} y={y} fill={fill} fontSize={fontSize} textAnchor={textAnchor}>
      <tspan x={x} dy="-0.55em">
        {lines[0]}
      </tspan>
      <tspan x={x} dy="1.2em">
        {lines[1]}
      </tspan>
    </text>
  )
}

export default function BarChart({
  data,
  bars,
  xKey,
  height = 300,
  orientation = 'vertical',
  stacked = false,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  loading = false,
  formatX,
  formatY,
  wrapCategoryLabels = false,
  barSize = 32,
}: BarChartProps) {
  const ct = useChartTheme()
  const h = ct.isMobile ? Math.round(height * 0.75) : height
  const isHorizontal = orientation === 'horizontal'

  if (loading) return <Skeleton variant="rectangular" width="100%" height={h} sx={{ borderRadius: 1 }} />

  const categoryTick = wrapCategoryLabels ? (
    <TwoLineCategoryTick
      fill={ct.axisStyle.fill as string | undefined}
      fontSize={ct.axisStyle.fontSize}
      formatter={isHorizontal ? formatY : formatX}
    />
  ) : undefined

  return (
    <ResponsiveContainer width="100%" height={h}>
      <RechartsBarChart
        data={data}
        layout={isHorizontal ? 'vertical' : 'horizontal'}
        barCategoryGap="20%"
        margin={{
          top: wrapCategoryLabels ? 8 : 4,
          right: ct.isMobile ? 4 : 16,
          left: ct.isMobile ? -10 : 0,
          bottom: wrapCategoryLabels && !isHorizontal ? 12 : 4,
        }}
      >
        {showGrid && (
          <CartesianGrid
            stroke={ct.gridProps.stroke}
            strokeDasharray={ct.gridProps.strokeDasharray}
            strokeOpacity={ct.gridProps.strokeOpacity}
            horizontal={!isHorizontal}
            vertical={isHorizontal}
          />
        )}
        {isHorizontal ? (
          <>
            <XAxis type="number" tick={ct.axisStyle} tickLine={false} axisLine={false} tickFormatter={formatX} />
            <YAxis
              type="category"
              dataKey={xKey}
              tick={categoryTick ?? ct.axisStyle}
              tickLine={false}
              axisLine={{ stroke: ct.gridProps.stroke }}
              width={ct.isMobile ? 96 : 132}
              tickFormatter={wrapCategoryLabels ? undefined : formatY}
              interval={0}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xKey}
              tick={categoryTick ?? ct.axisStyle}
              tickLine={false}
              axisLine={{ stroke: ct.gridProps.stroke }}
              tickFormatter={wrapCategoryLabels ? undefined : formatX}
              interval={0}
              angle={wrapCategoryLabels ? 0 : -28}
              textAnchor={wrapCategoryLabels ? 'middle' : 'end'}
              height={wrapCategoryLabels ? 48 : 56}
            />
            <YAxis tick={ct.axisStyle} tickLine={false} axisLine={false} width={ct.isMobile ? 30 : 42} tickFormatter={formatY} />
          </>
        )}
        {showTooltip && (
          <Tooltip
            contentStyle={ct.tooltipStyle}
            labelStyle={{ color: ct.theme.palette.text.secondary, fontSize: 11, marginBottom: 4 }}
            itemStyle={{ color: ct.theme.palette.text.primary, fontSize: 12 }}
            cursor={{ fill: ct.theme.palette.action.hover }}
          />
        )}
        {showLegend && bars.length > 1 && <Legend {...ct.legendProps} />}
        {bars.map((bar, i) => {
          const color = bar.color ?? ct.colors[i % ct.colors.length]
          // Only top bar gets rounded corners when stacked
          const isLast = i === bars.length - 1
          const radius: [number, number, number, number] =
            stacked && !isLast ? [0, 0, 0, 0] : [4, 4, 0, 0]
          const varyCategories = bars.length === 1 && !stacked
          return (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.label}
              fill={color}
              radius={radius}
              maxBarSize={barSize}
              stackId={stacked ? 'stack' : undefined}
              animationDuration={800}
            >
              {varyCategories
                ? data.map((_, idx) => (
                    <Cell key={`cell-${bar.key}-${idx}`} fill={ct.colors[idx % ct.colors.length]} />
                  ))
                : null}
            </Bar>
          )
        })}      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
