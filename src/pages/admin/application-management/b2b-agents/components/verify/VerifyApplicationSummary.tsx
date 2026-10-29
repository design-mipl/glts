import {
  ApplicationVerifyOverviewSummary,
  type ApplicationOverviewSummaryData,
} from '../../../shared/components/ApplicationVerifyOverviewSummary'

export function VerifyApplicationSummary({
  overview,
  isBulk,
}: {
  overview: ApplicationOverviewSummaryData
  isBulk?: boolean
}) {
  return (
    <ApplicationVerifyOverviewSummary overview={overview} isBulk={isBulk} customerSegment="b2bAgents" />
  )
}
