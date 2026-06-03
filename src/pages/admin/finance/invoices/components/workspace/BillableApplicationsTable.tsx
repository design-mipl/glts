import {
  Box,
  Checkbox as MuiCheckbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Badge } from '@/design-system/UIComponents'
import type { BulkBatchRow, SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import {
  getApplicantName,
  getAppointmentDate,
  getBillableApplicationRows,
  getApplicationBillingStatusLabel,
  resolveApplicationBillingEntity,
  resolveApplicationVessel,
} from '@/shared/utils/invoiceBillingEngine'
import { agreementEmbeddedTableHeadCellSx, agreementEmbeddedTableSx } from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'

interface BillableApplicationsTableProps {
  selectedIds: string[]
  selectedBatchIds: string[]
  onSelectionChange: (applicationIds: string[], batchIds: string[]) => void
}

function rowId(row: ApplicationListingRow): string {
  return row.id
}

function isBatchRow(row: ApplicationListingRow): boolean {
  return row.recordType === 'bulk'
}

export function BillableApplicationsTable({
  selectedIds,
  selectedBatchIds,
  onSelectionChange,
}: BillableApplicationsTableProps) {
  const rows = getBillableApplicationRows()

  const toggleRow = (row: ApplicationListingRow) => {
    const id = rowId(row)
    if (isBatchRow(row)) {
      const next = selectedBatchIds.includes(id)
        ? selectedBatchIds.filter(x => x !== id)
        : [...selectedBatchIds, id]
      onSelectionChange(selectedIds, next)
    } else {
      const next = selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id]
      onSelectionChange(next, selectedBatchIds)
    }
  }

  const isSelected = (row: ApplicationListingRow) =>
    isBatchRow(row) ? selectedBatchIds.includes(row.id) : selectedIds.includes(row.id)

  return (
    <Box>
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        Billable applications (Appointment Booked)
      </Typography>
      <Box sx={agreementEmbeddedTableSx}>
        {rows.length === 0 ? (
          <Box sx={{ py: 2, px: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              No applications with Appointment Booked status are available for billing.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto', maxHeight: 360 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...agreementEmbeddedTableHeadCellSx, width: 40 }} />
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>GLTS Reference</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Batch ID</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Company</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Applicant / Crew</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Country</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Visa Type</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Appointment Date</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Billing Entity</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Vessel</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Billing Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => {
                  const batchId = isBatchRow(row) ? row.id : '—'
                  const companyName = row.companyName ?? '—'
                  const billingStatus = getApplicationBillingStatusLabel(row)
                  const appRow = row as SingleApplicationRow | BulkBatchRow
                  return (
                    <TableRow key={row.id} hover selected={isSelected(row)} onClick={() => toggleRow(row)} sx={{ cursor: 'pointer' }}>
                      <TableCell padding="checkbox" onClick={e => e.stopPropagation()}>
                        <MuiCheckbox
                          size="small"
                          checked={isSelected(row)}
                          onChange={() => toggleRow(row)}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{isBatchRow(row) ? '—' : row.id}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{batchId}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{companyName}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{getApplicantName(appRow)}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{row.country}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{row.visaType}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{getAppointmentDate(appRow)}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{resolveApplicationBillingEntity(row)}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{resolveApplicationVessel(row)}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        <Badge
                          label={billingStatus}
                          color={billingStatus === 'Unbilled' ? 'neutral' : 'warning'}
                          size="sm"
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  )
}
