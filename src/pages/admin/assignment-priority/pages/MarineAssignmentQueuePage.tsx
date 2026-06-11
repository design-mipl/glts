import { AssignmentQueuePage } from './AssignmentQueuePage'
import { ASSIGNMENT_SEGMENTS } from '../config/assignmentSegmentConfig'

export function MarineAssignmentQueuePage() {
  return <AssignmentQueuePage segmentConfig={ASSIGNMENT_SEGMENTS.marine} />
}
