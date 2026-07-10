import { Box, Divider, Stack, Typography } from '@mui/material'
import { Drawer, Badge } from '@/design-system/UIComponents'
import type { FundAllocationPassengerRow } from '@/shared/types/fundAllocation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  customerSegmentDisplayLabel,
  fundAllocationStatusBadgeColor,
  fundAllocationStatusLabel,
} from '../config/fundAllocationStatusConfig'

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 11 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 13, mt: 0.25 }}>
        {value || '—'}
      </Typography>
    </Box>
  )
}

interface FundAllocationDetailDrawerProps {
  open: boolean
  record: FundAllocationPassengerRow | null
  onClose: () => void
}

export function FundAllocationDetailDrawer({ open, record, onClose }: FundAllocationDetailDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} title="Passenger fund allocation" width={480}>
      {record ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Badge
              label={fundAllocationStatusLabel(record.allocationStatus)}
              color={fundAllocationStatusBadgeColor(record.allocationStatus)}
            />
            <Badge label={customerSegmentDisplayLabel(record.customerSegment)} color="info" />
          </Box>

          <DetailField label="Passenger" value={record.passengerName} />
          <DetailField label="Application ID" value={record.gltsApplicationId} />
          <DetailField label="Applicant ID" value={record.gltsApplicantId} />
          <DetailField label="Company" value={record.companyName} />
          <DetailField label="Country / visa" value={`${record.country} • ${record.visaType}`} />
          <DetailField label="Jurisdiction" value={record.jurisdiction} />
          <DetailField label="Travel date" value={record.travelDate} />
          <DetailField label="VFS submission date" value={record.submissionDate} />
          <DetailField label="Appointment date" value={record.appointmentDate} />
          <DetailField label="Submission status" value={record.submissionStatus} />
          <DetailField
            label="Catalog total"
            value={record.suggestedAllocationAmount > 0 ? formatInr(record.suggestedAllocationAmount) : '—'}
          />

          {record.allocationStatus === 'allocated' ? (
            <>
              <Divider />
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                Allocated services
              </Typography>
              {record.selectedServices.length > 0 ? (
                <Stack spacing={1}>
                  {record.selectedServices.map(service => (
                    <Stack
                      key={service.id}
                      direction="row"
                      justifyContent="space-between"
                      spacing={1}
                      sx={{ fontSize: 13 }}
                    >
                      <Typography variant="body2" sx={{ fontSize: 13 }}>
                        {service.serviceName}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                        {formatInr(service.amount)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  No services recorded.
                </Typography>
              )}
              <DetailField
                label="Total value"
                value={record.totalAmount > 0 ? formatInr(record.totalAmount) : '—'}
              />
              <DetailField
                label="Allocated fund value"
                value={record.allocatedAmount > 0 ? formatInr(record.allocatedAmount) : '—'}
              />
              <DetailField label="Payment card" value={record.creditCardName} />
              <DetailField label="Allocated by" value={record.allocatedBy} />
              <DetailField label="Allocation notes" value={record.allocationNotes} />
            </>
          ) : null}
        </Box>
      ) : null}
    </Drawer>
  )
}
