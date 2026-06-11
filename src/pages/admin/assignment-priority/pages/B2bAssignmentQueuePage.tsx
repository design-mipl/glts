import { AssignmentQueuePage } from './AssignmentQueuePage'
import { ASSIGNMENT_SEGMENTS } from '../config/assignmentSegmentConfig'

export function B2bAssignmentQueuePage() {
  return <AssignmentQueuePage segmentConfig={ASSIGNMENT_SEGMENTS.b2b} />
}
