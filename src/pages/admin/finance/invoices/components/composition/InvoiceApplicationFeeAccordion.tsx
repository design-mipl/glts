import { Box, Collapse, Stack, Typography } from '@mui/material'
import { ChevronDown } from 'lucide-react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Badge } from '@/design-system/UIComponents'
import {
  invoiceCompositionAccordionDetailsSx,
  invoiceCompositionAccordionSx,
} from './invoiceCompositionAccordionStyles'

interface InvoiceApplicationFeeAccordionProps {
  id: string
  applicationName: string
  typeLabel: 'Single' | 'Bulk'
  meta?: Array<{ label: string; value: string }>
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
  children: ReactNode
}

export function InvoiceApplicationFeeAccordion({
  id,
  applicationName,
  typeLabel,
  meta = [],
  expanded,
  onExpandedChange,
  children,
}: InvoiceApplicationFeeAccordionProps) {
  const toggle = () => onExpandedChange(!expanded)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
    }
  }

  const visibleMeta = meta.filter(item => item.value && item.value !== '—')

  return (
    <Box sx={invoiceCompositionAccordionSx}>
      <Box
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-controls={`fee-app-panel-${id}`}
        id={`fee-app-header-${id}`}
        onClick={toggle}
        onKeyDown={onKeyDown}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
          px: { xs: 1.25, sm: 1.5 },
          py: 1,
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
          {/* Primary — applicant / application name */}
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.35 }}>
            <Typography
              variant="body2"
              fontWeight={700}
              noWrap
              title={applicationName || id}
              sx={{ fontSize: 14, lineHeight: 1.3, letterSpacing: '-0.01em' }}
            >
              {applicationName || id}
            </Typography>
            <Badge label={typeLabel} color={typeLabel === 'Bulk' ? 'info' : 'neutral'} size="sm" />
          </Stack>

          {/* Secondary — application / batch ID */}
          <Typography
            variant="body2"
            sx={{ fontSize: 12, lineHeight: 1.3, color: 'text.secondary' }}
            noWrap
            title={id}
          >
            {id}
          </Typography>

          {/* Tertiary — compact labeled meta */}
          {visibleMeta.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: 2,
                rowGap: 0.5,
                mt: 0.75,
                pt: 0.75,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              {visibleMeta.map(item => (
                <Box
                  key={item.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 0.5,
                    minWidth: 0,
                    maxWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'none' },
                  }}
                >
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: 10, fontWeight: 600, lineHeight: 1.3, flexShrink: 0 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ fontSize: 12, fontWeight: 500, lineHeight: 1.3, color: 'text.primary' }}
                    noWrap
                    title={item.value}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : null}
        </Box>

        <Box
          aria-hidden
          sx={{
            flexShrink: 0,
            width: 28,
            height: 28,
            mt: 0.1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
            borderRadius: 1,
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
          id={`fee-app-panel-${id}`}
          role="region"
          aria-labelledby={`fee-app-header-${id}`}
          sx={invoiceCompositionAccordionDetailsSx}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
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
        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 1 }}>
          {headerAction}
        </Stack>
      ) : null}
      <Stack spacing={1} sx={{ width: '100%' }}>
        {children}
      </Stack>
    </Box>
  )
}
