import { LayoutDashboard, ShieldCheck, Send, Radio } from 'lucide-react'
import type { WorkflowStep } from '../../components/workflowTimeline/types'

export const corporateProcessSteps: WorkflowStep[] = [
  {
    title: 'Requirements Visible on Portal',
    description:
      'Business visa requirements, embassy rules, and document checklists are available before applications begin.',
    icon: LayoutDashboard,
  },
  {
    title: 'Specialist Document Review',
    description:
      'Corporate visa specialists review invitation letters, employment records, travel purpose, and embassy requirements.',
    icon: ShieldCheck,
  },
  {
    title: 'Application & Submission Management',
    description:
      'Applications are prepared, submitted, and managed according to corporate travel timelines.',
    icon: Send,
  },
  {
    title: 'Tracking & Live Status Updates',
    description:
      'Authorized stakeholders receive live application updates, milestone notifications, and complete case visibility.',
    icon: Radio,
  },
]
