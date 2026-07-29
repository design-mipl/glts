export type TemplateDemoStatus = 'Active' | 'Pending' | 'Draft'
export type TemplateDemoPriority = 'low' | 'medium' | 'high'
export type TemplateDemoSlaRisk = 'on_track' | 'at_risk' | 'breached'
export type TemplateRecordKind = 'single' | 'bulk'
export type TemplateListingTab = 'single' | 'bulk' | 'draft' | 'submitted'

export interface TemplateDemoRecord {
  id: string
  reference: string
  name: string
  status: TemplateDemoStatus
  priority: TemplateDemoPriority
  assignee: string
  slaRisk: TemplateDemoSlaRisk
  country: string
  updatedAt: string
  recordKind: TemplateRecordKind
}

export const TEMPLATE_DEMO_ROWS: TemplateDemoRecord[] = [
  {
    id: '1',
    reference: 'REF-2401',
    name: 'Acme Travel — UAE business visa',
    status: 'Active',
    priority: 'high',
    assignee: 'Riya Sharma',
    slaRisk: 'at_risk',
    country: 'United Arab Emirates',
    updatedAt: '2026-05-27',
    recordKind: 'single',
  },
  {
    id: '2',
    reference: 'REF-2402',
    name: 'Horizon Corp — France tourist',
    status: 'Pending',
    priority: 'medium',
    assignee: 'Arjun Mehta',
    slaRisk: 'on_track',
    country: 'Germany',
    updatedAt: '2026-05-26',
    recordKind: 'single',
  },
  {
    id: '3',
    reference: 'REF-2403',
    name: 'Marine crew batch — Singapore',
    status: 'Active',
    priority: 'high',
    assignee: 'Unassigned',
    slaRisk: 'breached',
    country: 'Singapore',
    updatedAt: '2026-05-25',
    recordKind: 'bulk',
  },
  {
    id: '4',
    reference: 'REF-2404',
    name: 'Retail applicant — UK visitor',
    status: 'Draft',
    priority: 'low',
    assignee: 'Priya Nair',
    slaRisk: 'on_track',
    country: 'United Kingdom',
    updatedAt: '2026-05-24',
    recordKind: 'single',
  },
  {
    id: '5',
    reference: 'REF-2405',
    name: 'B2B partner batch — US B1/B2',
    status: 'Pending',
    priority: 'medium',
    assignee: 'Riya Sharma',
    slaRisk: 'at_risk',
    country: 'United States',
    updatedAt: '2026-05-23',
    recordKind: 'bulk',
  },
  {
    id: '6',
    reference: 'REF-2406',
    name: 'Corporate batch — Thailand',
    status: 'Active',
    priority: 'low',
    assignee: 'Arjun Mehta',
    slaRisk: 'on_track',
    country: 'Thailand',
    updatedAt: '2026-05-22',
    recordKind: 'bulk',
  },
  {
    id: '7',
    reference: 'REF-2407',
    name: 'Draft single — Japan business',
    status: 'Draft',
    priority: 'medium',
    assignee: 'Priya Nair',
    slaRisk: 'on_track',
    country: 'Japan',
    updatedAt: '2026-05-21',
    recordKind: 'single',
  },
  {
    id: '8',
    reference: 'REF-2408',
    name: 'Draft bulk — Canada study',
    status: 'Draft',
    priority: 'high',
    assignee: 'Unassigned',
    slaRisk: 'on_track',
    country: 'Canada',
    updatedAt: '2026-05-20',
    recordKind: 'bulk',
  },
]

export interface TemplateDemoFormData {
  reference: string
  name: string
  country: string
  priority: TemplateDemoPriority
  assignee: string
  notes: string
}

export const EMPTY_TEMPLATE_DEMO_FORM: TemplateDemoFormData = {
  reference: '',
  name: '',
  country: '',
  priority: 'medium',
  assignee: '',
  notes: '',
}

export const TEMPLATE_DEMO_DETAIL = TEMPLATE_DEMO_ROWS[0]
