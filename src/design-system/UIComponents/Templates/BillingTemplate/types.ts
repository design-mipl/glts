import type { TagVariant } from '@/design-system/UIComponents/Display/Tag'

export type InvoiceStatus =
  | 'Draft'
  | 'Sent'
  | 'Partially Paid'
  | 'Paid'
  | 'Overdue'
  | 'Unpaid'

export interface Invoice {
  id: string
  invoiceNo: string
  client: string
  project: string
  invoiceDate: string
  dueDate: string
  amount: number
  tds: number
  netReceivable: number
  status: InvoiceStatus
  createdAt: string
}

export interface InvoiceLineItem {
  id: string
  model: string
  product: string
  quantity: number
  unitPrice: number
  total: number
}

export interface InvoiceFormData {
  invoiceNo: string
  invoiceDate: string
  dueDate: string
  client: string
  project: string
  lineItems: InvoiceLineItem[]
  notes: string
  attachments: File[]
  amount: number
  tds: number
  netReceivable: number
}

export interface FilterOptions {
  status: string[]
  dateRange: [string, string]
  client: string
  amountRange: [number, number]
}

export interface KpiCardData {
  id: string
  label: string
  amount: number
  color: 'primary' | 'success' | 'warning' | 'info'
}

export const EMPTY_FORM: InvoiceFormData = {
  invoiceNo: '',
  invoiceDate: '',
  dueDate: '',
  client: '',
  project: '',
  lineItems: [],
  notes: '',
  attachments: [],
  amount: 0,
  tds: 0,
  netReceivable: 0,
}

export const DEFAULT_LINE_ITEM: Omit<InvoiceLineItem, 'id' | 'total'> = {
  model: '',
  product: '',
  quantity: 1,
  unitPrice: 0,
}

export const INVOICE_STATUS_VARIANT: Record<InvoiceStatus, TagVariant> = {
  Draft: 'neutral',
  Sent: 'info',
  'Partially Paid': 'warning',
  Paid: 'success',
  Overdue: 'error',
  Unpaid: 'error',
}

export const CLIENT_OPTIONS = [
  'Mr. Arun Sharma',
  'Greenfield Developers',
  'Priya Nair',
  'Metro Build Co.',
  'Sunrise Interiors',
  'Heritage Hotels',
  'Apex Constructions',
  'Blue Ocean Retail',
]
