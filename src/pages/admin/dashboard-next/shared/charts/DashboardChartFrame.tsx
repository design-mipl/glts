import { ChartPanel, type ChartPanelProps } from '../widgets/ChartPanel'

export type DashboardChartFrameProps = ChartPanelProps

/** Uniform loading / empty / error frame around DS chart children. */
export function DashboardChartFrame(props: DashboardChartFrameProps) {
  return <ChartPanel {...props} />
}
