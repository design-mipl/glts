import { useState } from 'react'
import { Box, Card, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  BackButton,
  Breadcrumb,
  Button,
  Stepper,
  FormSection,
  useToast,
} from '@/design-system/components'
import {
  BillingFormSections,
  BillingDetailSections,
  EMPTY_FORM,
} from '@/design-system/UIComponents/Templates/BillingTemplate'
import type { InvoiceFormData } from '@/design-system/UIComponents/Templates/BillingTemplate/types'
import { formatINR } from '../hooks/useBillingData'
import type { Invoice } from '@/design-system/UIComponents/Templates/BillingTemplate/types'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'

const STEPS = [
  { label: 'Basic info', description: 'Invoice and client details' },
  { label: 'Line items', description: 'Products and services' },
  { label: 'Totals & attachments', description: 'Summary and files' },
  { label: 'Review', description: 'Confirm and save' },
]

function formToReviewInvoice(data: InvoiceFormData): Invoice {
  return {
    id: 'preview',
    invoiceNo: data.invoiceNo || 'INV-NEW',
    client: data.client || '—',
    project: data.project || '—',
    invoiceDate: data.invoiceDate || '—',
    dueDate: data.dueDate || '—',
    amount: data.amount,
    tds: data.tds,
    netReceivable: data.netReceivable,
    status: 'Draft',
    createdAt: new Date().toISOString().slice(0, 10),
  }
}

export default function StepperFormPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<InvoiceFormData>({ ...EMPTY_FORM })

  const handleNext = () => setActiveStep((s) => Math.min(s + 1, STEPS.length - 1))
  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0))

  const handleFinish = () => {
    showToast({
      title: 'Invoice created',
      description: 'Stepper flow completed successfully.',
      variant: 'success',
    })
    navigate('/billings')
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <BackButton href="/billings" />
        <Breadcrumb
          items={[
            { label: 'Billings', href: '/billings' },
            { label: 'Create invoice (stepper)' },
          ]}
        />
      </Box>

      <Stepper steps={STEPS} activeStep={activeStep} sx={{ mb: 4 }} />

      <Card
        elevation={0}
        sx={{
          border: `${BORDER_WIDTH.thin} solid`,
          borderColor: 'divider',
          borderRadius: BORDER_RADIUS.lg,
          boxShadow: SHADOWS.sm,
          bgcolor: 'background.paper',
          p: 3,
          mb: 3,
          minHeight: 320,
        }}
      >
        {activeStep === 0 && (
          <BillingFormSections
            data={formData}
            onChange={setFormData}
            showLineItems={false}
            showNotes={false}
          />
        )}

        {activeStep === 1 && (
          <BillingFormSections
            data={formData}
            onChange={setFormData}
            showLineItems
            showNotes={false}
            showPaymentDetails={false}
          />
        )}

        {activeStep === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormSection title="Totals" columns={1} divider={false}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                  <Typography variant="body2">{formatINR(formData.amount)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    TDS
                  </Typography>
                  <Typography variant="body2">-{formatINR(formData.tds)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight={600}>
                    Net total
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {formatINR(formData.netReceivable)}
                  </Typography>
                </Box>
              </Box>
            </FormSection>
            <BillingFormSections
              data={formData}
              onChange={setFormData}
              showLineItems={false}
              showPaymentDetails={false}
              showNotes
            />
          </Box>
        )}

        {activeStep === 3 && (
          <BillingDetailSections invoice={formToReviewInvoice(formData)} lineItems={formData.lineItems} />
        )}
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          variant="outlined"
          color="secondary"
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Previous
        </Button>
        {activeStep === STEPS.length - 1 ? (
          <Button variant="contained" color="primary" onClick={handleFinish}>
            Finish
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  )
}
