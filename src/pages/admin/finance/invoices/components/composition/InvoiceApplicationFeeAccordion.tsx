import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material'
import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '@/design-system/UIComponents'
import {
  invoiceCompositionAccordionDetailsSx,
  invoiceCompositionAccordionSx,
  invoiceCompositionAccordionSummarySx,
} from './invoiceCompositionAccordionStyles'

interface InvoiceApplicationFeeAccordionProps {
  id: string
  applicationName: string
  typeLabel: 'Single' | 'Bulk'
  subtitle: string
  meta?: Array<{ label: string; value: string }>
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
  children: ReactNode
}

export function InvoiceApplicationFeeAccordion({
  id,
  applicationName,
  typeLabel,
  subtitle,
  meta = [],
  expanded,
  onExpandedChange,
  children,
}: InvoiceApplicationFeeAccordionProps) {
  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={expanded}
      onChange={(_, isExpanded) => onExpandedChange(isExpanded)}
      sx={invoiceCompositionAccordionSx}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={18} strokeWidth={2} />}
        sx={invoiceCompositionAccordionSummarySx}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: 14 }}>
              {id}
            </Typography>
            <Badge label={typeLabel} color={typeLabel === 'Bulk' ? 'info' : 'neutral'} size="sm" />
          </Stack>
          <Box sx={{ minWidth: 0, mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, display: 'block' }}>
              Application name
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }} noWrap title={applicationName}>
              {applicationName || '—'}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {subtitle}
          </Typography>
          {meta.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
                gap: 1,
                mt: 1,
              }}
            >
              {meta.map(item => (
                <Box key={item.label} sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 12 }} noWrap title={item.value}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : null}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ ...invoiceCompositionAccordionDetailsSx, px: { xs: 1.5, sm: 2 } }}>
        {children}
      </AccordionDetails>
    </Accordion>
  )
}

interface InvoiceApplicationFeeAccordionListProps {
  children: ReactNode
  headerAction?: ReactNode
}

export function InvoiceApplicationFeeAccordionList({ children, headerAction }: InvoiceApplicationFeeAccordionListProps) {
  return (
    <Box>
      {headerAction ? (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 1.5 }}>
          {headerAction}
        </Stack>
      ) : null}
      <Stack spacing={1.5} sx={{ width: '100%' }}>
        {children}
      </Stack>
    </Box>
  )
}
