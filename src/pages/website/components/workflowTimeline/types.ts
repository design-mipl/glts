import type { LucideIcon } from 'lucide-react'

export interface WorkflowStep {
  title: string
  description: string
  icon: LucideIcon
}

export interface WorkflowTimelineSectionProps {
  id?: string
  sectionLabel: string
  heading: string
  subheading: string
  steps: WorkflowStep[]
}
