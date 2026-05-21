import { useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton, Breadcrumb, useToast } from '@/design-system/components'
import {
  BillingFormSections,
  BillingFormCard,
  EMPTY_FORM,
} from '@/design-system/UIComponents/Templates/BillingTemplate'
import type { InvoiceFormData } from '@/design-system/UIComponents/Templates/BillingTemplate/types'
import { useBillingData } from '../hooks/useBillingData'

export default function FormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { getInvoiceById } = useBillingData()
  const isEdit = Boolean(id)
  const invoice = id ? getInvoiceById(id) : undefined

  const [formData, setFormData] = useState<InvoiceFormData>(() => {
    if (invoice) {
      return {
        ...EMPTY_FORM,
        invoiceNo: invoice.invoiceNo,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        client: invoice.client,
        project: invoice.project,
        amount: invoice.amount,
        tds: invoice.tds,
        netReceivable: invoice.netReceivable,
        lineItems: [
          {
            id: '1',
            model: 'Premium',
            product: 'Modular kitchen',
            quantity: 1,
            unitPrice: invoice.amount,
            total: invoice.amount,
          },
        ],
      }
    }
    return { ...EMPTY_FORM }
  })

  const pageTitle = isEdit ? 'Edit invoice' : 'Add invoice'
  const subtitle = isEdit
    ? 'Update invoice details and line items'
    : 'Fill in the details to create an invoice'

  const handleSave = () => {
    showToast({
      title: 'Invoice saved',
      description: isEdit ? 'Changes saved successfully.' : 'New invoice created.',
      variant: 'success',
    })
    navigate('/billings')
  }

  const handleSaveDraft = () => {
    showToast({
      title: 'Draft saved',
      description: 'Invoice saved as draft.',
      variant: 'info',
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <BackButton href="/billings" />
        <Breadcrumb
          items={[
            { label: 'Billings', href: '/billings' },
            { label: pageTitle },
          ]}
        />
      </Box>

      <Box sx={{ maxWidth: 960, mx: 'auto' }}>
        <BillingFormCard
          title={pageTitle}
          subtitle={subtitle}
          onCancel={() => navigate('/billings')}
          onSaveDraft={handleSaveDraft}
          onSave={handleSave}
        >
          <BillingFormSections data={formData} onChange={setFormData} />
        </BillingFormCard>
      </Box>
    </Box>
  )
}
