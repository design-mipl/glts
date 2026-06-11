import { AssignmentQueuePage } from './AssignmentQueuePage'
import { ASSIGNMENT_SEGMENTS } from '../config/assignmentSegmentConfig'

export function CorporateAssignmentQueuePage() {
  return <AssignmentQueuePage segmentConfig={ASSIGNMENT_SEGMENTS.corporate} />
}
