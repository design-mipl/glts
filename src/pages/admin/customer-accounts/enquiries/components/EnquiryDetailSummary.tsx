import { Grid, Stack, Typography } from '@mui/material'
import { BaseCard, Badge } from '@/design-system/UIComponents'
import type { EnquiryRecord } from '@/shared/types/enquiry'
import {
  formatEnquiryInquirySource,
  formatEnquiryProcessingType,
} from '../config/enquiryFormConfig'
import { enquiryStatusColor, enquiryStatusLabel } from '../config/enquiryStatusConfig'
import { EnquiryQuickActions } from './EnquiryQuickActions'

interface EnquiryDetailSummaryProps {
  enquiry: EnquiryRecord
  onEdit: () => void
  onAssign: () => void
  onFollowup: () => void
  onStatus: () => void
  onConvert: () => void
  onNotes: () => void
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value || '--'}
      </Typography>
    </Stack>
  )
}

export function EnquiryDetailSummary({
  enquiry,
  onEdit,
  onAssign,
  onFollowup,
  onStatus,
  onConvert,
  onNotes,
}: EnquiryDetailSummaryProps) {
  const enquiryDate = enquiry.enquiryDate
    ? new Date(enquiry.enquiryDate).toLocaleDateString()
    : '--'
  const visaSummary = [
    enquiry.visaRequirement.countries.join(', '),
    enquiry.visaRequirement.visaType,
    formatEnquiryProcessingType(enquiry.visaRequirement.processingType),
  ]
    .filter((part) => part && part !== '--')
    .join(' · ')

  return (
    <BaseCard sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1.5}>
          <Stack spacing={0.75} sx={{ minWidth: 0 }}>
            <Typography variant="h5" component="h1" fontWeight={700} noWrap={false}>
              {enquiry.customer.companyOrCustomerName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {enquiry.id} · Enquiry date {enquiryDate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {enquiry.customer.contactPersonName} · {enquiry.customer.contactNumber} ·{' '}
              {enquiry.customer.emailAddress}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatEnquiryInquirySource(enquiry.salesDetails.inquirySource)}
              {visaSummary ? ` · ${visaSummary}` : ''}
            </Typography>
          </Stack>
          <Badge
            label={enquiryStatusLabel[enquiry.status]}
            color={enquiryStatusColor[enquiry.status]}
            sx={{ alignSelf: { xs: 'flex-start', md: 'flex-start' } }}
          />
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <SummaryField label="Customer type" value={enquiry.customer.customerType} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <SummaryField
              label="Inquiry source"
              value={formatEnquiryInquirySource(enquiry.salesDetails.inquirySource)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <SummaryField label="Country" value={enquiry.visaRequirement.countries.join(', ')} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <SummaryField label="Visa type" value={enquiry.visaRequirement.visaType} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <SummaryField label="Purpose" value={enquiry.visaRequirement.purposeOfVisit ?? '--'} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <SummaryField
              label="Processing"
              value={formatEnquiryProcessingType(enquiry.visaRequirement.processingType)}
            />
          </Grid>
        </Grid>

        <EnquiryQuickActions
          onEdit={onEdit}
          onAssign={onAssign}
          onFollowup={onFollowup}
          onStatus={onStatus}
          onConvert={onConvert}
          onNotes={onNotes}
        />
      </Stack>
    </BaseCard>
  )
}
