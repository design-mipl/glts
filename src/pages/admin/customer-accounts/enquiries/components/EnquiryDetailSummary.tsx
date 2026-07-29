import { Box, Stack, Typography } from '@mui/material'
import { ArrowRight, PencilLine } from 'lucide-react'
import { BaseCard, Badge, Button } from '@/design-system/UIComponents'
import type { EnquiryRecord } from '@/shared/types/enquiry'
import { canConvertLeadToQuotation } from '@/shared/config/clientManagementPipelineConfig'
import { enquiryStatusColor, enquiryStatusLabel } from '../config/enquiryStatusConfig'

interface EnquiryDetailSummaryProps {
  enquiry: EnquiryRecord
  onEdit: () => void
  onConvert?: () => void
}

export function EnquiryDetailSummary({ enquiry, onEdit, onConvert }: EnquiryDetailSummaryProps) {
  const enquiryDate = enquiry.enquiryDate
    ? new Date(enquiry.enquiryDate).toLocaleDateString()
    : '--'
  const canConvert = canConvertLeadToQuotation(enquiry.status)

  return (
    <BaseCard>
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {enquiry.customer.companyOrCustomerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {enquiry.id} · Enquiry date {enquiryDate}
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={0.75}
              useFlexGap
              sx={{ flexWrap: 'wrap', alignItems: 'center', alignSelf: { xs: 'stretch', md: 'flex-start' } }}
            >
              <Button
                label="Edit Enquiry"
                size="sm"
                variant="neutral"
                startIcon={<PencilLine size={14} />}
                onClick={onEdit}
              />
              {canConvert && onConvert ? (
                <Button
                  label="Convert to Quotation"
                  size="sm"
                  startIcon={<ArrowRight size={14} />}
                  onClick={onConvert}
                />
              ) : null}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge
              label={enquiryStatusLabel[enquiry.status]}
              color={enquiryStatusColor[enquiry.status]}
              size="sm"
            />
          </Stack>
        </Stack>
      </Box>
    </BaseCard>
  )
}
