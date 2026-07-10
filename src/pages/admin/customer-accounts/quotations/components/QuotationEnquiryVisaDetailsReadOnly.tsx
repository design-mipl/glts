import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import type { EnquiryRecord } from '@/shared/types/enquiry'
import { getVisaRequirementItems, purposeOfVisitTableTextSx } from '@/shared/utils/enquiryVisaRequirementUtils'

interface QuotationEnquiryVisaDetailsReadOnlyProps {
  enquiry: EnquiryRecord
}

export function QuotationEnquiryVisaDetailsReadOnly({ enquiry }: QuotationEnquiryVisaDetailsReadOnlyProps) {
  const visaItems = getVisaRequirementItems(enquiry.visaRequirement)

  if (visaItems.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No country requirements recorded on this enquiry.
      </Typography>
    )
  }

  return (
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
  )
}
