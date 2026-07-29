import type { EnquiryPriority, EnquiryStatus } from '@/shared/types/enquiry'
import {
  clientManagementPipelineColor,
  clientManagementPipelineLabel,
} from '@/shared/config/clientManagementPipelineConfig'

export const enquiryStatusLabel = clientManagementPipelineLabel

export const enquiryStatusColor = clientManagementPipelineColor

export const enquiryPriorityLabel: Record<EnquiryPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

export const enquiryPriorityColor: Record<
  EnquiryPriority,
  'neutral' | 'info' | 'warning' | 'success' | 'error'
> = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  critical: 'error',
}

export type { EnquiryStatus }
