import { Box, Collapse, Stack, Typography } from '@mui/material'
import { ChevronDown } from 'lucide-react'
import type { KeyboardEvent, ReactNode } from 'react'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  invoiceCompositionNestedAccordionDetailsSx,
  invoiceCompositionNestedAccordionSx,
} from './invoiceCompositionAccordionStyles'

interface ApplicantFeeAccordionProps {
  applicantId: string
  applicantName: string
  passportNumber: string
  country?: string
  visaType?: string
  serviceCount: number
  servicesTotal: number
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
  children: ReactNode
}

export function ApplicantFeeAccordion({
  applicantId,
  applicantName,
  passportNumber,
  country,
  visaType,
  serviceCount,
  servicesTotal,
  expanded,
  onExpandedChange,
  children,
}: ApplicantFeeAccordionProps) {
  const metaBits = [
    applicantId,
    passportNumber ? `Passport ${passportNumber}` : null,
    country && country !== '—' ? country : null,
    visaType && visaType !== '—' ? visaType : null,
  ].filter(Boolean)

  const toggle = () => onExpandedChange(!expanded)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
    }
  }

  return (
    <Box sx={invoiceCompositionNestedAccordionSx}>
      <Box
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-controls={`fee-applicant-panel-${applicantId}`}
        id={`fee-applicant-header-${applicantId}`}
        onClick={toggle}
        onKeyDown={onKeyDown}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: { xs: 1.25, sm: 1.5 },
          py: 0.875,
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': { bgcolor: 'action.hover' },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: -2,
          },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ fontSize: 13, lineHeight: 1.35 }}
            noWrap
            title={applicantName}
          >
            {applicantName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', fontSize: 11, lineHeight: 1.4 }}
            noWrap
            title={metaBits.join(' · ')}
          >
            {metaBits.join(' · ')}
          </Typography>
        </Box>

        <Stack
          alignItems="flex-end"
          spacing={0.15}
          sx={{ flexShrink: 0, display: { xs: 'none', sm: 'flex' } }}
        >
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, whiteSpace: 'nowrap' }}>
            {formatInr(servicesTotal)}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, whiteSpace: 'nowrap' }}>
            {serviceCount} service{serviceCount === 1 ? '' : 's'}
          </Typography>
        </Stack>

        <Box
          aria-hidden
          sx={{
            flexShrink: 0,
            width: 28,
            height: 28,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
          }}
        >
          <ChevronDown
            size={16}
            strokeWidth={2}
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 150ms ease',
            }}
          />
        </Box>
      </Box>

      <Collapse in={expanded} timeout="auto">
        <Box
          id={`fee-applicant-panel-${applicantId}`}
          role="region"
          aria-labelledby={`fee-applicant-header-${applicantId}`}
          sx={invoiceCompositionNestedAccordionDetailsSx}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  )
}
