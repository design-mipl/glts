import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from '@mui/material'
import { ChevronDown } from 'lucide-react'
import type { BulkBatchRow, SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import {
  getAppointmentDate,
  resolveApplicationBillingEntity,
  resolveApplicationVessel,
} from '@/shared/utils/invoiceBillingEngine'
import { getBulkBatchApplicantCount, listBulkBatchApplicants } from '../../utils/invoiceFeeCompositionUtils'

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
        {value || '—'}
      </Typography>
    </Grid>
  )
}

function ApplicantDetailsGrid({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <Grid container spacing={1.5}>
      {items.map(item => (
        <DetailField key={item.label} label={item.label} value={item.value} />
      ))}
    </Grid>
  )
}

function SingleApplicationDetails({ row }: { row: SingleApplicationRow }) {
  return (
    <ApplicantDetailsGrid
      items={[
        { label: 'Applicant Name', value: row.applicantName },
        { label: 'Passport Number', value: row.passportNumber },
        { label: 'Country', value: row.country },
        { label: 'Visa Type', value: row.visaType },
        { label: 'Appointment Date', value: getAppointmentDate(row) },
        { label: 'Travel Date', value: row.travelDate },
        { label: 'Billing Entity', value: resolveApplicationBillingEntity(row) },
        { label: 'Vessel', value: resolveApplicationVessel(row) },
        { label: 'PO Reference', value: row.poReference ?? '—' },
      ]}
    />
  )
}

function BulkApplicationDetails({ row }: { row: BulkBatchRow }) {
  const applicants = listBulkBatchApplicants(row)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <ApplicantDetailsGrid
        items={[
          { label: 'Company Name', value: row.companyName },
          { label: 'Total Applicants', value: String(getBulkBatchApplicantCount(row)) },
          { label: 'Country', value: row.country },
          { label: 'Visa Type', value: row.visaType },
          { label: 'Appointment Date', value: getAppointmentDate(row) },
          { label: 'Billing Entity', value: resolveApplicationBillingEntity(row) },
          { label: 'Vessel', value: resolveApplicationVessel(row) },
        ]}
      />
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        Applicants in batch
      </Typography>
      {applicants.map(applicant => (
        <Accordion
          key={applicant.applicantId}
          disableGutters
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '10px !important',
            '&:before': { display: 'none' },
            bgcolor: 'background.paper',
          }}
        >
          <AccordionSummary
            expandIcon={<ChevronDown size={16} />}
            sx={{ minHeight: 40, '& .MuiAccordionSummary-content': { my: 0.75 } }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                {applicant.applicantName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {applicant.applicantId} · Passport {applicant.passportNumber}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 1.5, px: 2 }}>
            <ApplicantDetailsGrid
              items={[
                { label: 'Applicant Name', value: applicant.applicantName },
                { label: 'Applicant ID', value: applicant.applicantId },
                { label: 'Passport Number', value: applicant.passportNumber },
                { label: 'Country', value: applicant.country },
                { label: 'Visa Type', value: applicant.visaType },
              ]}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

interface BillableApplicationDetailContentProps {
  row: ApplicationListingRow
}

export function BillableApplicationDetailContent({ row }: BillableApplicationDetailContentProps) {
  if (row.recordType === 'bulk') {
    return <BulkApplicationDetails row={row as BulkBatchRow} />
  }
  return <SingleApplicationDetails row={row as SingleApplicationRow} />
}
