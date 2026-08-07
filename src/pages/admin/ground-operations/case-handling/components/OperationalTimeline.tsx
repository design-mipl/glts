import { ApplicationProcessingTimeline } from '@/pages/customer/features/applications/components/ApplicationProcessingTimeline'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import { buildOperationalCaseProcessingTimeline } from '@/shared/utils/operationalCaseProcessingTimeline'

interface OperationalTimelineProps {
  record: OperationalCase
}

/** Passenger application processing timeline for a ground-ops case. */
export function OperationalTimeline({ record }: OperationalTimelineProps) {
  const steps = buildOperationalCaseProcessingTimeline(record)
  return <ApplicationProcessingTimeline steps={steps} orientation="vertical" />
}
