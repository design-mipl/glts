import { useState } from 'react'
import { Box, Collapse, Divider, Grid, IconButton, Stack, Typography } from '@mui/material'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Badge } from '@/design-system/UIComponents'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import { ApplicantFeeAccordion } from './ApplicantFeeAccordion'
import {
  InvoiceCompositionContextStrip,
  InvoiceCompositionKpiRow,
} from './InvoiceCompositionKpiRow'
import type {
  ApplicantFeeBundle,
  BulkApplicationFeeCard,
  InvoiceCompositionMode,
  InvoiceFeeCompositionState,
  SingleApplicationFeeCard,
} from '../../types/invoiceFeeComposition.types'
import { effectiveServiceLineAmount } from '../../utils/invoiceFeeCompositionUtils'
import { InvoiceBillableServicesTable } from './InvoiceBillableServicesTable'
import { InvoiceConsulateRefundsSection } from './InvoiceConsulateRefundsSection'

function applicantServicesTotal(applicant: ApplicantFeeBundle, mode: InvoiceCompositionMode = 'generate'): number {
  return applicant.serviceLines.reduce((sum, line) => sum + effectiveServiceLineAmount(line, mode), 0)
}

function MetaGrid({ items }: { items: [string, string][] }) {
  return (
    <Grid container spacing={1.5}>
      {items.map(([label, value]) => (
        <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            {label}
          </Typography>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
            {value}
          </Typography>
        </Grid>
      ))}
    </Grid>
  )
}

interface ApplicantFeeEditorProps {
  applicant: ApplicantFeeBundle
  onChange: (next: ApplicantFeeBundle) => void
  nested?: boolean
  agreement?: CommercialAgreement | null
  allowAddServices?: boolean
  mode?: InvoiceCompositionMode
}

function ApplicantFeeEditor({
  applicant,
  onChange,
  nested = false,
  agreement,
  allowAddServices = true,
  mode = 'generate',
}: ApplicantFeeEditorProps) {
  return (
    <Box sx={nested ? undefined : { border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 2, bgcolor: 'background.paper' }}>
      {!nested ? (
        <MetaGrid
          items={[
            ['Applicant Name', applicant.applicantName],
            ['Applicant ID', applicant.applicantId],
            ['Passport Number', applicant.passportNumber],
            ['Country', applicant.country],
            ['Visa Type', applicant.visaType],
          ]}
        />
      ) : null}
      {!nested ? <Divider sx={{ my: 2 }} /> : null}
      <InvoiceBillableServicesTable
        lines={applicant.serviceLines}
        onChange={serviceLines => onChange({ ...applicant, serviceLines })}
        agreement={agreement}
        country={applicant.country}
        visaType={applicant.visaType}
        allowAddServices={allowAddServices}
        mode={mode}
      />
      <InvoiceConsulateRefundsSection
        refunds={applicant.consulateRefunds ?? []}
        onChange={consulateRefunds => onChange({ ...applicant, consulateRefunds })}
      />
    </Box>
  )
}

interface SingleApplicationFeeCardViewProps {
  card: SingleApplicationFeeCard
  onChange: (next: SingleApplicationFeeCard) => void
  /** Inside Generate Invoice accordion — hides duplicate chrome. */
  embedded?: boolean
  agreement?: CommercialAgreement | null
  allowAddServices?: boolean
  mode?: InvoiceCompositionMode
}

export function SingleApplicationFeeCardView({
  card,
  onChange,
  embedded = false,
  agreement,
  allowAddServices = true,
  mode = 'generate',
}: SingleApplicationFeeCardViewProps) {
  return (
    <Box sx={embedded ? { py: 0.5, px: 0 } : { border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      {!embedded ? (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 14 }}>
            {card.applicationId}
          </Typography>
          <Badge label="Single" color="info" size="sm" />
        </Stack>
      ) : null}
      {!embedded ? (
        <>
          <MetaGrid
            items={[
              ['Company Name', card.companyName],
              ['Applicant Name', card.applicantName],
              ['Country', card.country],
              ['Visa Type', card.visaType],
              ['Billing Entity', card.billingEntity],
              ['Vessel', card.vessel],
            ]}
          />
          <Divider sx={{ my: 2 }} />
        </>
      ) : null}
      <InvoiceBillableServicesTable
        lines={card.serviceLines}
        onChange={serviceLines => onChange({ ...card, serviceLines })}
        agreement={agreement}
        country={card.country}
        visaType={card.visaType}
        allowAddServices={allowAddServices}
        mode={mode}
      />
      <InvoiceConsulateRefundsSection
        refunds={card.consulateRefunds ?? []}
        onChange={consulateRefunds => onChange({ ...card, consulateRefunds })}
      />
    </Box>
  )
}

interface BulkApplicationFeeCardViewProps {
  card: BulkApplicationFeeCard
  onChange: (next: BulkApplicationFeeCard) => void
  embedded?: boolean
  agreement?: CommercialAgreement | null
  allowAddServices?: boolean
  mode?: InvoiceCompositionMode
}

export function BulkApplicationFeeCardView({
  card,
  onChange,
  embedded = false,
  agreement,
  allowAddServices = true,
  mode = 'generate',
}: BulkApplicationFeeCardViewProps) {
  const toggleExpanded = () => onChange({ ...card, expanded: !card.expanded })
  const showFeeEditors = embedded || card.expanded
  const [expandedApplicants, setExpandedApplicants] = useState<string[]>(() => {
    const firstWithServices = card.applicants.find(a => a.serviceLines.length > 0)
    return firstWithServices ? [firstWithServices.applicantId] : card.applicants[0] ? [card.applicants[0].applicantId] : []
  })

  const toggleApplicantExpanded = (applicantId: string, open: boolean) => {
    setExpandedApplicants(prev =>
      open ? [...prev.filter(id => id !== applicantId), applicantId] : prev.filter(id => id !== applicantId),
    )
  }

  const updateApplicant = (applicantId: string, next: ApplicantFeeBundle) => {
    onChange({
      ...card,
      applicants: card.applicants.map(a => (a.applicantId === applicantId ? next : a)),
    })
  }

  return (
    <Box sx={embedded ? { py: 0.5, px: 0 } : { border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      {!embedded ? (
        <Stack direction="row" alignItems="flex-start" spacing={1}>
          <IconButton size="small" onClick={toggleExpanded} sx={{ mt: 0.25 }}>
            {card.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 14 }}>
                {card.batchId}
              </Typography>
              <Badge label="Bulk" color="success" size="sm" />
            </Stack>
            <MetaGrid
              items={[
                ['Company Name', card.companyName],
                ['Total Applicants', String(card.totalApplicants)],
                ['Country', card.country],
                ['Visa Type', card.visaType],
                ['Billing Entity', card.billingEntity],
                ['Vessel', card.vessel],
              ]}
            />
          </Box>
        </Stack>
      ) : null}

      <Collapse in={showFeeEditors}>
        <Stack spacing={1.25} sx={{ mt: embedded ? 0 : 2, pl: embedded ? 0 : { xs: 0, sm: 4 } }}>
          <Stack spacing={0.75}>
            {card.applicants.map(applicant => (
              <ApplicantFeeAccordion
                key={applicant.applicantId}
                applicantId={applicant.applicantId}
                applicantName={applicant.applicantName}
                passportNumber={applicant.passportNumber}
                country={applicant.country}
                visaType={applicant.visaType}
                serviceCount={applicant.serviceLines.length}
                servicesTotal={applicantServicesTotal(applicant, mode)}
                expanded={expandedApplicants.includes(applicant.applicantId)}
                onExpandedChange={open => toggleApplicantExpanded(applicant.applicantId, open)}
              >
                <ApplicantFeeEditor
                  nested
                  applicant={applicant}
                  agreement={agreement}
                  allowAddServices={allowAddServices}
                  mode={mode}
                  onChange={next => updateApplicant(applicant.applicantId, next)}
                />
              </ApplicantFeeAccordion>
            ))}
          </Stack>
        </Stack>
      </Collapse>
    </Box>
  )
}

interface InvoiceCompositionSelectionSummaryProps {
  state: InvoiceFeeCompositionState
  billingEntityOptions: Array<{ value: string; label: string }>
  onBillingEntityChange: (value: string) => void
  onDocumentDateChange: (value: string) => void
  billingTypeLabel: string
  documentDateLabel?: string
}

export function InvoiceCompositionSelectionSummary({
  state,
  billingEntityOptions,
  onBillingEntityChange,
  onDocumentDateChange,
  billingTypeLabel,
  documentDateLabel,
}: InvoiceCompositionSelectionSummaryProps) {
  const totalApplications = state.singles.length + state.bulks.length
  const totalApplicants =
    state.singles.length + state.bulks.reduce((sum, b) => sum + b.applicants.length, 0)

  return (
    <Box sx={{ width: '100%' }}>
      <InvoiceCompositionKpiRow
        totalApplications={totalApplications}
        singleCount={state.singles.length}
        bulkCount={state.bulks.length}
        totalApplicants={totalApplicants}
      />
      <InvoiceCompositionContextStrip
        companyName={state.companyName || '—'}
        billingEntity={state.billingEntity}
        billingEntityOptions={billingEntityOptions}
        onBillingEntityChange={onBillingEntityChange}
        billingTypeLabel={billingTypeLabel}
        documentDate={state.documentDate}
        onDocumentDateChange={onDocumentDateChange}
        documentDateLabel={documentDateLabel}
      />
    </Box>
  )
}
