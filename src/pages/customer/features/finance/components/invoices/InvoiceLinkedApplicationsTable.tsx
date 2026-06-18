import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import type { Invoice } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { buildLinkedApplicationRows } from '../../utils/financeInvoiceUtils'

interface InvoiceLinkedApplicationsTableProps {
  invoice: Invoice
  onNavigateApplication?: (applicationId: string) => void
}

export function InvoiceLinkedApplicationsTable({
  invoice,
  onNavigateApplication,
}: InvoiceLinkedApplicationsTableProps) {
  const rows = buildLinkedApplicationRows(invoice)

  if (rows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No linked applications on this invoice.
      </Typography>
    )
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Application ID</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Booker</TableCell>
          <TableCell>Pax / Crew</TableCell>
          <TableCell>Country</TableCell>
          <TableCell>Visa Type</TableCell>
          <TableCell align="right">Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.applicationId} hover>
            <TableCell>
              <Typography
                variant="body2"
                fontWeight={600}
                color="primary.main"
                sx={{ cursor: onNavigateApplication ? 'pointer' : 'default', fontSize: 13 }}
                onClick={() => onNavigateApplication?.(row.applicationId)}
              >
                {row.applicationId}
              </Typography>
            </TableCell>
            <TableCell>{row.applicationType === 'bulk' ? 'Bulk' : 'Single'}</TableCell>
            <TableCell>{row.bookerName}</TableCell>
            <TableCell>{row.passengerCrewCount}</TableCell>
            <TableCell>{row.country}</TableCell>
            <TableCell>{row.visaType}</TableCell>
            <TableCell align="right">{formatInr(row.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}