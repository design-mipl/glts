import { Box } from '@mui/material'
import {
  FormField,
  FormSection,
  Input,
  Select,
  Textarea,
  FileUpload,
} from '@/design-system/components'
import type { InvoiceFormData } from '../types'
import BillingLineItems from './BillingLineItems'
import { CLIENT_OPTIONS } from '../types'

export interface BillingFormSectionsProps {
  data: InvoiceFormData
  onChange: (data: InvoiceFormData) => void
  showLineItems?: boolean
  showNotes?: boolean
  showPaymentDetails?: boolean
}

export default function BillingFormSections({
  data,
  onChange,
  showLineItems = true,
  showNotes = true,
  showPaymentDetails = true,
}: BillingFormSectionsProps) {
  const patch = (partial: Partial<InvoiceFormData>) => onChange({ ...data, ...partial })

  const clientOptions = CLIENT_OPTIONS.map((c) => ({ label: c, value: c }))

  const parseAmount = (value: string) => {
    const num = Number.parseFloat(value.replace(/[^\d.-]/g, ''))
    return Number.isFinite(num) ? num : 0
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <FormSection title="Invoice details" columns={2} divider={false}>
        <FormField label="Invoice no." required>
          <Input
            placeholder="e.g., INV-2026-001"
            value={data.invoiceNo}
            onChange={(value) => patch({ invoiceNo: value })}
          />
        </FormField>
        <FormField label="Invoice date" required>
          <Input
            type="date"
            value={data.invoiceDate}
            onChange={(value) => patch({ invoiceDate: value })}
          />
        </FormField>
        <FormField label="Client" required>
          <Select
            placeholder="Select client"
            value={data.client}
            onChange={(val) => patch({ client: String(val) })}
            options={clientOptions}
          />
        </FormField>
        <FormField label="Project" optional>
          <Input
            placeholder="Enter project name"
            value={data.project}
            onChange={(value) => patch({ project: value })}
          />
        </FormField>
      </FormSection>

      {showPaymentDetails && (
        <FormSection title="Payment details" columns={2} divider={false}>
          <FormField label="Amount" required>
            <Input
              placeholder="₹ 0"
              value={data.amount ? String(data.amount) : ''}
              onChange={(value) => {
                const amount = parseAmount(value)
                const tds = data.tds || Math.round(amount * 0.01)
                patch({
                  amount,
                  netReceivable: amount - tds,
                })
              }}
            />
          </FormField>
          <FormField label="TDS" optional>
            <Input
              placeholder="₹ 0"
              value={data.tds ? String(data.tds) : ''}
              onChange={(value) => {
                const tds = parseAmount(value)
                patch({
                  tds,
                  netReceivable: data.amount - tds,
                })
              }}
            />
          </FormField>
          <FormField label="Net receivable" required>
            <Input
              placeholder="₹ 0"
              value={data.netReceivable ? String(data.netReceivable) : ''}
              onChange={(value) => patch({ netReceivable: parseAmount(value) })}
            />
          </FormField>
          <FormField label="Due date" required>
            <Input
              type="date"
              value={data.dueDate}
              onChange={(value) => patch({ dueDate: value })}
            />
          </FormField>
        </FormSection>
      )}

      {showLineItems && (
        <FormSection title="Line items" columns={1} divider={false}>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <BillingLineItems
              items={data.lineItems}
              onChange={(lineItems) => {
                const amount = lineItems.reduce((sum, li) => sum + li.total, 0)
                const tds = Math.round(amount * 0.01)
                patch({
                  lineItems,
                  amount,
                  tds,
                  netReceivable: amount - tds,
                })
              }}
            />
          </Box>
        </FormSection>
      )}

      {showNotes && (
        <FormSection title="Notes & attachments" columns={1} divider={false}>
          <FormField label="Notes" optional>
            <Textarea
              value={data.notes}
              onChange={(value) => patch({ notes: value })}
              minRows={3}
            />
          </FormField>
          <FormField label="Attachments" optional>
            <FileUpload multiple onUpload={(files) => patch({ attachments: files })} />
          </FormField>
        </FormSection>
      )}
    </Box>
  )
}
