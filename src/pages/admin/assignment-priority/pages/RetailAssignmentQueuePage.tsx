import { AssignmentQueuePage } from './AssignmentQueuePage'
import { ASSIGNMENT_SEGMENTS } from '../config/assignmentSegmentConfig'

export function RetailAssignmentQueuePage() {
  return <AssignmentQueuePage segmentConfig={ASSIGNMENT_SEGMENTS.retail} />
}
