import { Grid, Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { BaseCard, Button } from '@/design-system/UIComponents'
import type { EnquiryRecord } from '@/shared/types/enquiry'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import {
  formatEnquiryInquirySource,
} from '../../config/enquiryFormConfig'
import { getVisaRequirementItems, purposeOfVisitTableTextSx } from '@/shared/utils/enquiryVisaRequirementUtils'

function Field({ label, value }: { label: string; value?: string | number | boolean }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
        {String(value ?? '--')}
      </Typography>
    </Stack>
  )
}

interface OverviewTabProps {
  enquiry: EnquiryRecord
  onUploadAttachment?: () => void
}

export function OverviewTab({ enquiry, onUploadAttachment }: OverviewTabProps) {
  const notes =
    enquiry.notes.initialDiscussionNotes ||
    [enquiry.notes.customerExpectations, enquiry.notes.specialInstructions].filter(Boolean).join('\n\n') ||
    undefined
  const visaItems = getVisaRequirementItems(enquiry.visaRequirement)

  return (
    <Stack spacing={2}>
      <BaseCard sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Customer &amp; Enquiry Information
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field label="Company / Customer Name" value={enquiry.customer.companyOrCustomerName} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field label="Customer Type" value={enquiry.customer.customerType} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field label="Contact Person" value={enquiry.customer.contactPersonName} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field label="Contact" value={enquiry.customer.contactNumber} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field label="Email" value={enquiry.customer.emailAddress} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field label="Company Address" value={enquiry.customer.companyAddress} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field
              label="Inquiry Source"
              value={formatEnquiryInquirySource(enquiry.salesDetails.inquirySource)}
            />
          </Grid>
        </Grid>
      </BaseCard>

      <BaseCard sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Visa Requirement Details
        </Typography>
        {visaItems.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No country requirements recorded.
          </Typography>
        ) : (
          <Box sx={agreementEmbeddedTableSx}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Country</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Visa Type</TableCell>
                  <TableCell sx={{ ...agreementEmbeddedTableHeadCellSx, width: '36%' }}>Purpose of Visit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visaItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.country}</TableCell>
                    <TableCell>{item.visaType}</TableCell>
                    <TableCell sx={{ maxWidth: 0, width: '36%' }}>
                      <Typography variant="body2" sx={purposeOfVisitTableTextSx}>
                        {item.purposeOfVisit || '—'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </BaseCard>

      <BaseCard sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle2">Additional Information</Typography>
          <Field label="Notes / Internal Remarks" value={notes} />

          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2">Attachments</Typography>
              {onUploadAttachment ? (
                <Button label="Upload attachment" size="sm" variant="outlined" onClick={onUploadAttachment} />
              ) : null}
            </Stack>
            {enquiry.attachments.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No attachments uploaded yet.
              </Typography>
            ) : (
              enquiry.attachments.map((item) => (
                <Stack
                  key={item.id}
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={1}
                  sx={{
                    py: 1,
                    borderTop: 1,
                    borderColor: 'divider',
                    '&:first-of-type': { borderTop: 0, pt: 0 },
                  }}
                >
                  <Stack spacing={0.25}>
                    <Typography variant="body2" fontWeight={600}>
                      {item.fileName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Version {item.version} · {item.fileType.toUpperCase()} · {item.fileSizeKb} KB ·{' '}
                      {new Date(item.uploadedAt).toLocaleDateString()}
                    </Typography>
                  </Stack>
                  <Button label="Download" size="sm" variant="outlined" />
                </Stack>
              ))
            )}
          </Stack>
        </Stack>
      </BaseCard>
    </Stack>
  )
}
