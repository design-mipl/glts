import { Box, Divider, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import type { QuotationRecord } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { getLatestApprovedVersion, getCurrentVersion } from '@/shared/utils/quotationValidation'
import { agreementEmbeddedTableHeadCellSx } from '../../agreements/components/agreementFormLayout'

interface QuotationPdfPreviewPanelProps {
  quotation: QuotationRecord
}

export function QuotationPdfPreviewPanel({ quotation }: QuotationPdfPreviewPanelProps) {
  const version = getLatestApprovedVersion(quotation) ?? getCurrentVersion(quotation)
  const pricing = version?.pricingMatrix ?? []

  return (
    <Box id="quotation-pdf-preview" sx={{ p: 4, bgcolor: 'background.paper', maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
        Commercial Quotation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {quotation.quotationNo} · Valid till {quotation.validTill}
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="subtitle2">Company Information</Typography>
          <Typography variant="body2">{quotation.customer.companyName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {quotation.customer.companyAddress}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Contact Information</Typography>
          <Typography variant="body2">{quotation.customer.contactPersonName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {quotation.customer.contactNumber} · {quotation.customer.emailAddress}
          </Typography>
        </Box>
      </Stack>

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Pricing Table {version ? `(${version.versionLabel})` : ''}
      </Typography>
      <Table size="small" sx={{ mb: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Country</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Visa Type</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Fee</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>GST</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pricing.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.country}</TableCell>
              <TableCell>{row.visaType}</TableCell>
              <TableCell>{row.servicePresetName}</TableCell>
              <TableCell>{formatInr(row.serviceFee)}</TableCell>
              <TableCell>{row.gstApplicable ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {version ? (
        <Stack spacing={0.5} sx={{ mb: 3, maxWidth: 320, ml: 'auto' }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Subtotal</Typography>
            <Typography variant="body2">{formatInr(version.totals.subtotal)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">GST ({quotation.gstPercentage}%)</Typography>
            <Typography variant="body2">{formatInr(version.totals.gstAmount)}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2" fontWeight={700}>
              Grand Total
            </Typography>
            <Typography variant="subtitle2" fontWeight={700}>
              {formatInr(version.totals.grandTotal)}
            </Typography>
          </Stack>
        </Stack>
      ) : null}

      {quotation.notes ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Notes</Typography>
          <Typography variant="body2">{quotation.notes}</Typography>
        </Box>
      ) : null}

      <Box>
        <Typography variant="subtitle2">Terms & Conditions</Typography>
        <Typography variant="body2" color="text.secondary">
          Pricing is valid until the stated validity date. Services are subject to embassy and consulate fee
          changes. GST is applicable as per prevailing tax regulations. Payment terms will be defined in the
          commercial agreement.
        </Typography>
      </Box>
    </Box>
  )
}
