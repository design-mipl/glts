import { Box, Divider, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { alpha, useTheme } from '@mui/material/styles'
import { Badge } from '@/design-system/UIComponents'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { deriveAdvanceRuleSummary } from '@/shared/utils/commercialAgreementValidation'
import { getSelectedFinanceContactPersons } from '@/shared/utils/agreementFinanceContacts'
import {
  agreementTypeLabel,
  billingTypeLabel,
  customerSourceModeLabel,
  onboardingDocumentStatusLabel,
  workflowTypeLabel,
} from '../config/agreementStatusConfig'

interface AgreementReviewPanelProps {
  data: CommercialAgreementFormData
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={2} sx={{ fontSize: 13 }}>
      <Typography component="span" sx={{ fontWeight: 600, minWidth: 120, color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography component="span" color="text.primary">
        {value || '—'}
      </Typography>
    </Stack>
  )
}

function ReviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack spacing={1}>
      <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ fontSize: 13 }}>
        {title}
      </Typography>
      {children}
    </Stack>
  )
}

export function AgreementReviewPanel({ data }: AgreementReviewPanelProps) {
  const theme = useTheme()
  const selectedFinanceContacts = getSelectedFinanceContactPersons(data)
  const companyLabel =
    data.customerSourceMode === 'existing'
      ? data.company.companyName || data.existingCompanyId
      : data.company.companyName

  const uploadedDocs = data.documents.filter((d) => d.status === 'uploaded' || d.status === 'verified').length

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        bgcolor: theme.palette.mode === 'light' ? 'grey.50' : alpha('#fff', 0.04),
        p: 2,
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5 }}>
        Review before submit
      </Typography>
      <Stack spacing={2} divider={<Divider flexItem />}>
        <ReviewSection title="Company">
          <ReviewRow label="Company" value={companyLabel} />
          <ReviewRow label="Source" value={customerSourceModeLabel[data.customerSourceMode]} />
          <ReviewRow label="Entities" value={String(data.entities.length)} />
        </ReviewSection>

        <ReviewSection title="Commercial terms">
          <ReviewRow label="Agreement type" value={agreementTypeLabel[data.agreementType]} />
          <ReviewRow label="Workflow" value={workflowTypeLabel[data.workflowType]} />
          <ReviewRow label="Billing" value={billingTypeLabel[data.billingType]} />
          <ReviewRow
            label="Advance rule"
            value={deriveAdvanceRuleSummary(data.billingType, data.billingConfig)}
          />
          <ReviewRow
            label="Credit limit"
            value={
              data.billingConfig.creditLimit
                ? `₹${data.billingConfig.creditLimit.toLocaleString('en-IN')}`
                : '—'
            }
          />
        </ReviewSection>

        <ReviewSection title="Pricing">
          <ReviewRow label="Pricing rows" value={String(data.pricingMatrix.length)} />
        </ReviewSection>

        <ReviewSection title="Finance & documents">
          <ReviewRow label="Finance contacts" value={String(selectedFinanceContacts.length)} />
          {selectedFinanceContacts.map((contact) => (
            <ReviewRow
              key={contact.id}
              label={contact.sourceLabel}
              value={[contact.contactPerson, contact.email, contact.phone].filter(Boolean).join(' · ')}
            />
          ))}
          <ReviewRow label="Documents uploaded" value={`${uploadedDocs} of ${data.documents.length}`} />
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ pt: 0.5 }}>
            {data.documents.map((doc) => (
              <Badge
                key={doc.documentKey}
                label={`${doc.name}: ${onboardingDocumentStatusLabel[doc.status]}`}
                color={doc.status === 'verified' || doc.status === 'uploaded' ? 'success' : 'neutral'}
                size="sm"
              />
            ))}
          </Stack>
        </ReviewSection>
      </Stack>
    </Box>
  )
}
