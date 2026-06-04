import { useState } from 'react'
import { Box, Collapse, Divider, Grid, IconButton, Stack, Typography } from '@mui/material'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Badge } from '@/design-system/UIComponents'
import { ApplicantFeeAccordion } from './ApplicantFeeAccordion'
import {
  InvoiceCompositionContextStrip,
  InvoiceCompositionKpiRow,
} from './InvoiceCompositionKpiRow'
import type {
  ApplicantFeeBundle,
  BulkApplicationFeeCard,
  InvoiceFeeCompositionState,
} from '../../types/invoiceFeeComposition.types'
import type { SingleApplicationFeeCard } from '../../types/invoiceFeeComposition.types'
import { INVOICE_COMPOSITION_FEE_LABELS } from '../../config/invoiceFeeCategoryLabels'
import { RepeatableFeeTable } from './RepeatableFeeTable'
import { SimpleFeeFields } from './SimpleFeeFields'

const FEE = INVOICE_COMPOSITION_FEE_LABELS

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
}

function ApplicantFeeEditor({ applicant, onChange, nested = false }: ApplicantFeeEditorProps & { nested?: boolean }) {
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
      <Stack spacing={2}>
        <SimpleFeeFields
          title={FEE.processingCharges.section}
          value={applicant.gltsFees}
          onChange={gltsFees => onChange({ ...applicant, gltsFees })}
        />
        <SimpleFeeFields
          title={FEE.visaFees.section}
          value={applicant.visaFees}
          onChange={visaFees => onChange({ ...applicant, visaFees })}
        />
        <RepeatableFeeTable
          title={FEE.courierFees.section}
          addLabel={FEE.courierFees.addRow}
          variant="handling"
          rows={applicant.handlingFees}
          onChange={handlingFees => onChange({ ...applicant, handlingFees })}
        />
        <RepeatableFeeTable
          title={FEE.miscellaneousFees.section}
          addLabel={FEE.miscellaneousFees.addRow}
          variant="miscellaneous"
          rows={applicant.miscellaneousFees}
          onChange={miscellaneousFees => onChange({ ...applicant, miscellaneousFees })}
        />
      </Stack>
    </Box>
  )
}

interface SingleApplicationFeeCardViewProps {
  card: SingleApplicationFeeCard
  onChange: (next: SingleApplicationFeeCard) => void
  /** Inside Generate Invoice accordion — hides duplicate chrome. */
  embedded?: boolean
}

function SingleFeeSections({
  card,
  onChange,
}: {
  card: SingleApplicationFeeCard
  onChange: (next: SingleApplicationFeeCard) => void
}) {
  return (
    <Stack spacing={2}>
      <SimpleFeeFields
        title={FEE.processingCharges.section}
        value={card.gltsFees}
        onChange={gltsFees => onChange({ ...card, gltsFees })}
      />
      <SimpleFeeFields
        title={FEE.visaFees.section}
        value={card.visaFees}
        onChange={visaFees => onChange({ ...card, visaFees })}
      />
      <RepeatableFeeTable
        title={FEE.courierFees.section}
        addLabel={FEE.courierFees.addRow}
        variant="handling"
        rows={card.handlingFees}
        onChange={handlingFees => onChange({ ...card, handlingFees })}
      />
      <RepeatableFeeTable
        title={FEE.miscellaneousFees.section}
        addLabel={FEE.miscellaneousFees.addRow}
        variant="miscellaneous"
        rows={card.miscellaneousFees}
        onChange={miscellaneousFees => onChange({ ...card, miscellaneousFees })}
      />
    </Stack>
  )
}

export function SingleApplicationFeeCardView({ card, onChange, embedded = false }: SingleApplicationFeeCardViewProps) {
  return (
    <Box sx={embedded ? { py: 1.5, px: { xs: 0, sm: 0.5 } } : { border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
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
      <SingleFeeSections card={card} onChange={onChange} />
    </Box>
  )
}

interface BulkApplicationFeeCardViewProps {
  card: BulkApplicationFeeCard
  onChange: (next: BulkApplicationFeeCard) => void
  embedded?: boolean
}

export function BulkApplicationFeeCardView({
  card,
  onChange,
  embedded = false,
}: BulkApplicationFeeCardViewProps) {
  const toggleExpanded = () => onChange({ ...card, expanded: !card.expanded })
  const showFeeEditors = embedded || card.expanded
  const [expandedApplicants, setExpandedApplicants] = useState<string[]>([])

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
    <Box sx={embedded ? { p: 2 } : { border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
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
        <Stack spacing={1.5} sx={{ mt: embedded ? 0 : 2, pl: embedded ? 0 : { xs: 0, sm: 4 } }}>
          <Stack spacing={1}>
            {card.applicants.map(applicant => (
              <ApplicantFeeAccordion
                key={applicant.applicantId}
                applicantId={applicant.applicantId}
                applicantName={applicant.applicantName}
                passportNumber={applicant.passportNumber}
                expanded={expandedApplicants.includes(applicant.applicantId)}
                onExpandedChange={open => toggleApplicantExpanded(applicant.applicantId, open)}
              >
                <ApplicantFeeEditor
                  nested
                  applicant={applicant}
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
  billingTypeLabel: string
}

export function InvoiceCompositionSelectionSummary({
  state,
  billingEntityOptions,
  onBillingEntityChange,
  billingTypeLabel,
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
      />
    </Box>
  )
}
