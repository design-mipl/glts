import { Badge } from '@/design-system/UIComponents'
import {
  assignmentFundDisplayBadgeColor,
  assignmentFundDisplayLabel,
  getAssignmentFundDisplayStateForPassenger,
} from '../utils/assignmentFundDisplayUtils'

interface AssignmentFundStatusBadgeProps {
  passengerId: string
  size?: 'sm' | 'md'
}

export function AssignmentFundStatusBadge({ passengerId, size = 'sm' }: AssignmentFundStatusBadgeProps) {
  const state = getAssignmentFundDisplayStateForPassenger(passengerId)

  return (
    <Badge
      label={assignmentFundDisplayLabel(state)}
      color={assignmentFundDisplayBadgeColor(state)}
      size={size}
    />
  )
}
