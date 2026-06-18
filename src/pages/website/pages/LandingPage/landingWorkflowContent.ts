import { FileUp, ShieldCheck, Cog, BadgeCheck } from 'lucide-react'
import type { WorkflowStep } from '../../components/workflowTimeline/types'

export const landingWorkflowSteps: WorkflowStep[] = [
  {
    title: 'Submit Requirement',
    description:
      'Share travel details, visa category, and required documents through the portal.',
    icon: FileUp,
  },
  {
    title: 'Expert Review',
    description: 'Specialists review documents, identify gaps, and guide corrections.',
    icon: ShieldCheck,
  },
  {
    title: 'Application Processing',
    description:
      'Applications are prepared, submitted, and monitored through embassy processing.',
    icon: Cog,
  },
  {
    title: 'Visa Delivered',
    description:
      'Receive your approved visa with complete status visibility and post-decision support.',
    icon: BadgeCheck,
  },
]
