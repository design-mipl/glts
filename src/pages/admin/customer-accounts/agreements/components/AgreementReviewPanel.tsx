import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { alpha, useTheme } from '@mui/material/styles'
import { Badge } from '@/design-system/UIComponents'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { deriveAdvanceRuleSummary } from '@/shared/utils/commercialAgreementValidation'
import { splitAgreementDocuments } from '@/shared/utils/agreementDocumentUtils'
import { getSelectedFinanceContactPersons } from '@/shared/utils/agreementFinanceContacts'
import {
  agreementTypeLabel,
  billingTypeLabel,
  customerSourceModeLabel,
  onboardingDocumentStatusLabel,
  workflowTypeLabel,
} from '../config/agreementStatusConfig'
import { formatAgreementDate } from '../utils/agreementFormUtils'

interface AgreementReviewPanelProps {
  data: CommercialAgreementFormData
  agreementId?: string
  statusLabel?: string
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.35}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

function ReviewSection({ title, children }: { title: string; children: ReactNode }) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        px: 1.5,
        py: 1.25,
        bgcolor: theme.palette.mode === 'light' ? '#fff' : alpha('#fff', 0.02),
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}

export function AgreementReviewPanel({ data, agreementId, statusLabel }: AgreementReviewPanelProps) {
  const theme = useTheme()
  const selectedFinanceContacts = getSelectedFinanceContactPersons(data)
  const { onboardingDocuments, agreementDocument } = splitAgreementDocuments(data.documents)
  const companyLabel =
    data.customerSourceMode === 'existing'
      ? data.company.companyName || data.existingCompanyId
      : data.company.companyName

  const uploadedDocs = data.documents.filter((d) => d.status === 'uploaded' || d.status === 'verified').length
  const requiredDocs = data.documents.filter((d) => d.required).length

  const statCards = [
    { label: 'Entities', value: String(data.entities.length) },
    {
      label: 'Processing visa fees',
      value: String(data.commercialVisaPricing?.length || data.pricingMatrix.length),
    },
    {
      label: 'Misc services',
      value: String(data.miscellaneousServices?.length || data.miscellaneousCosts.length),
    },
    { label: 'Documents', value: `${uploadedDocs}/${requiredDocs}` },
  ]

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
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 1.5 }}>
        <Box>
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
            Review before submit
          </Typography>
          {agreementId ? (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: 'block' }}>
              {agreementId}
            </Typography>
          ) : null}
        </Box>
        {statusLabel ? <Badge label={statusLabel} color="neutral" size="sm" /> : null}
      </Stack>

      <Stack spacing={2}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            gap: 1,
          }}
        >
          {statCards.map((item) => (
            <Box
              key={item.label}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1.5,
                px: 1.25,
                py: 1,
                bgcolor: theme.palette.mode === 'light' ? '#fff' : alpha('#fff', 0.02),
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {item.label}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 0.25, fontWeight: 700 }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>

        <ReviewSection title="Company">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              columnGap: 2,
              rowGap: 1.25,
            }}
          >
            <ReviewRow label="Company" value={companyLabel} />
            <ReviewRow label="Source" value={customerSourceModeLabel[data.customerSourceMode]} />
          </Box>
        </ReviewSection>

        <ReviewSection title="Commercial terms">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              columnGap: 2,
              rowGap: 1.25,
            }}
          >
            <ReviewRow label="Agreement type" value={agreementTypeLabel[data.agreementType]} />
            <ReviewRow label="Workflow" value={workflowTypeLabel[data.workflowType]} />
            <ReviewRow label="Agreement start date" value={formatAgreementDate(data.startDate)} />
            <ReviewRow label="Agreement expiry date" value={formatAgreementDate(data.endDate)} />
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
          </Box>
        </ReviewSection>

        <ReviewSection title="Finance & documents">
          <Stack spacing={1.25}>
            <ReviewRow label="Finance contacts" value={String(selectedFinanceContacts.length)} />
            {selectedFinanceContacts.map((contact) => (
              <ReviewRow
                key={contact.id}
                label={contact.sourceLabel}
                value={[contact.contactPerson, contact.email, contact.phone].filter(Boolean).join(' · ')}
              />
            ))}
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Onboarding documents
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.75}>
                {onboardingDocuments.map((doc) => (
                  <Badge
                    key={doc.documentKey}
                    label={`${doc.name}: ${onboardingDocumentStatusLabel[doc.status]}`}
                    color={doc.status === 'verified' || doc.status === 'uploaded' ? 'success' : 'neutral'}
                    size="sm"
                  />
                ))}
              </Stack>
            </Stack>
            {agreementDocument ? (
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Agreement document
                </Typography>
                <Badge
                  label={`${agreementDocument.name}: ${onboardingDocumentStatusLabel[agreementDocument.status]}`}
                  color={
                    agreementDocument.status === 'verified' || agreementDocument.status === 'uploaded'
                      ? 'success'
                      : 'neutral'
                  }
                  size="sm"
                />
              </Stack>
            ) : null}
          </Stack>
        </ReviewSection>
      </Stack>
    </Box>
  )
}
