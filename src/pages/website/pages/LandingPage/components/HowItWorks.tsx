import { WorkflowTimelineSection } from '../../../components/workflowTimeline/WorkflowTimelineSection'
import { landingWorkflowSteps } from '../landingWorkflowContent'

export function HowItWorks() {
  return (
    <WorkflowTimelineSection
      id="how-it-works"
      sectionLabel="Operational Workflow"
      heading="How GreenLight Works"
      subheading="From application to decision, every step is reviewed, tracked, and visible."
      steps={landingWorkflowSteps}
    />
  )
}
