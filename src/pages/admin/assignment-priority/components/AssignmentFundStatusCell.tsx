import { Badge } from '@/design-system/UIComponents'
import {
  assignmentFundDisplayBadgeColor,
  assignmentFundDisplayLabel,
  getAssignmentFundDisplayStateForPassenger,
} from '../utils/assignmentFundDisplayUtils'

interface AssignmentFundStatusCellProps {
  passengerId: string
}

export function AssignmentFundStatusCell({ passengerId }: AssignmentFundStatusCellProps) {
  const state = getAssignmentFundDisplayStateForPassenger(passengerId)

  return (
    <Badge
      label={assignmentFundDisplayLabel(state)}
      color={assignmentFundDisplayBadgeColor(state)}
      size="sm"
    />
  )
}
