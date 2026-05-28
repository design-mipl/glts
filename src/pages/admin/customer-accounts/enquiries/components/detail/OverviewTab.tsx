import { Grid, Stack, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import type { EnquiryRecord } from '@/shared/types/enquiry'

function Field({ label, value }: { label: string; value?: string | number | boolean }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{String(value ?? '--')}</Typography>
    </Stack>
  )
}

export function OverviewTab({ enquiry }: { enquiry: EnquiryRecord }) {
  return (
    <Stack spacing={2}>
      <BaseCard sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Customer Information
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}><Field label="Company / Customer" value={enquiry.customer.companyOrCustomerName} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Field label="Customer Type" value={enquiry.customer.customerType} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Field label="Contact Person" value={enquiry.customer.contactPersonName} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Field label="Contact Number" value={enquiry.customer.contactNumber} /></Grid>
        </Grid>
      </BaseCard>

      <BaseCard sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Requirement Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}><Field label="Countries" value={enquiry.visaRequirement.countries.join(', ')} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Field label="Visa Type" value={enquiry.visaRequirement.visaType} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Field label="No. of Applicants" value={enquiry.visaRequirement.numberOfApplicants} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Field label="Marine Requirement" value={enquiry.visaRequirement.marineRequirement ? 'Yes' : 'No'} /></Grid>
        </Grid>
      </BaseCard>
    </Stack>
  )
}
