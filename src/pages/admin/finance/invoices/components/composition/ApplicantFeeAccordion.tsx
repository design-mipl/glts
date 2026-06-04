import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  invoiceCompositionAccordionDetailsSx,
  invoiceCompositionAccordionSx,
  invoiceCompositionAccordionSummarySx,
} from './invoiceCompositionAccordionStyles'

interface ApplicantFeeAccordionProps {
  applicantId: string
  applicantName: string
  passportNumber: string
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
  children: ReactNode
}

export function ApplicantFeeAccordion({
  applicantId,
  applicantName,
  passportNumber,
  expanded,
  onExpandedChange,
  children,
}: ApplicantFeeAccordionProps) {
  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={expanded}
      onChange={(_, isExpanded) => onExpandedChange(isExpanded)}
      sx={invoiceCompositionAccordionSx}
    >
      <AccordionSummary expandIcon={<ChevronDown size={16} />} sx={invoiceCompositionAccordionSummarySx}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
            {applicantName}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {applicantId} · Passport {passportNumber}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={invoiceCompositionAccordionDetailsSx}>{children}</AccordionDetails>
    </Accordion>
  )
}
