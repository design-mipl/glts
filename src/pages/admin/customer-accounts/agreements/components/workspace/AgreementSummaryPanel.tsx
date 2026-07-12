import { Stack, Typography } from '@mui/material'
import { Badge } from '@/design-system/UIComponents'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { validateForActivation } from '@/shared/utils/commercialAgreementValidation'
import {
  agreementTypeLabel,
  billingTypeLabel,
  customerSourceModeLabel,
  workflowTypeLabel,
} from '../../config/agreementStatusConfig'
import { formatAgreementDate } from '../../utils/agreementFormUtils'

interface AgreementSummaryPanelProps {
  formData: CommercialAgreementFormData
  agreementId?: string
  statusLabel?: string
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ fontSize: 13 }}>
      <Typography component="span" color="text.secondary">
        {label}
      </Typography>
      <Typography component="span" fontWeight={600} color="text.primary" sx={{ textAlign: 'right' }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

export function AgreementSummaryPanel({ formData, agreementId, statusLabel = 'Draft' }: AgreementSummaryPanelProps) {
  const companyName =
    formData.customerSourceMode === 'existing'
      ? formData.company.companyName || formData.existingCompanyId
      : formData.company.companyName

  const uploadedDocs = formData.documents.filter(
    (d) => d.status === 'uploaded' || d.status === 'verified',
  ).length
  const requiredDocs = formData.documents.filter((d) => d.required).length
  const validation = validateForActivation(formData)

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" fontWeight={600}>
          Agreement summary
        </Typography>
        {agreementId ? <SummaryRow label="Agreement ID" value={agreementId} /> : null}
        <SummaryRow label="Status" value={statusLabel} />
        <SummaryRow label="Company" value={companyName} />
        <SummaryRow label="Source" value={customerSourceModeLabel[formData.customerSourceMode]} />
        <SummaryRow label="Workflow" value={workflowTypeLabel[formData.workflowType]} />
        <SummaryRow label="Billing" value={billingTypeLabel[formData.billingType]} />
        <SummaryRow label="Agreement type" value={agreementTypeLabel[formData.agreementType]} />
        <SummaryRow label="Agreement start date" value={formatAgreementDate(formData.startDate)} />
        <SummaryRow label="Agreement expiry date" value={formatAgreementDate(formData.endDate)} />
        <SummaryRow label="Entities" value={String(formData.entities.length)} />
        <SummaryRow
          label="Visa pricing"
          value={String(formData.commercialVisaPricing?.length || formData.pricingMatrix.length)}
        />
        <SummaryRow
          label="Misc services"
          value={String(formData.miscellaneousServices?.length || formData.miscellaneousCosts.length)}
        />
        <SummaryRow label="Documents" value={`${uploadedDocs}/${requiredDocs} required`} />
      </Stack>

      {!validation.ok ? (
        <Stack spacing={0.75}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Activation blockers
          </Typography>
          {validation.issues.slice(0, 5).map((issue) => (
            <Badge key={issue} label={issue} color="warning" size="sm" />
          ))}
          {validation.issues.length > 5 ? (
            <Typography variant="caption" color="text.secondary">
              +{validation.issues.length - 5} more
            </Typography>
          ) : null}
        </Stack>
      ) : (
        <Badge label="Ready for activation" color="success" size="sm" />
      )}
    </Stack>
  )
}
