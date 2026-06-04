import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { ChevronDown } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

export type DrawerNavSummaryVariant = 'complete' | 'progress' | 'neutral'

interface ApplicantDrawerNavSectionProps {
  step: number
  title: string
  summary: ReactNode
  selected: boolean
  expanded: boolean
  onSelect: () => void
  /** Shown below the header when the section is collapsed. */
  collapsedHint?: ReactNode
  children?: ReactNode
  /** Grow to use remaining sidebar height (e.g. document list). */
  fillAvailableHeight?: boolean
}

export function ApplicantDrawerNavSection({
  step,
  title,
  summary,
  selected,
  expanded,
  onSelect,
  collapsedHint,
  children,
  fillAvailableHeight = false,
}: ApplicantDrawerNavSectionProps) {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      aria-labelledby={`drawer-nav-step-${step}`}
      sx={{
        border: `1px solid ${selected ? colors.navy : colors.border}`,
        borderRadius: '12px',
        overflow: 'hidden',
        bgcolor: colors.white,
        boxShadow: selected ? `0 0 0 1px ${colors.navy}` : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        flex: fillAvailableHeight ? '1 1 auto' : '0 0 auto',
        minHeight: fillAvailableHeight ? 0 : undefined,
        display: fillAvailableHeight ? 'flex' : 'block',
        flexDirection: fillAvailableHeight ? 'column' : undefined,
      }}
    >
      <Box
        component="button"
        type="button"
        id={`drawer-nav-step-${step}`}
        onClick={onSelect}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: 1.5,
          py: 1.25,
          textAlign: 'left',
          cursor: 'pointer',
          border: 'none',
          bgcolor: selected ? colors.greenMuted : colors.surfaceAlt,
          borderBottom:
            expanded && children ? `1px solid ${colors.border}` : 'none',
          '&:hover': {
            bgcolor: selected ? colors.greenMuted : colors.surface,
          },
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '8px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 800,
            bgcolor: selected ? colors.navy : colors.white,
            color: selected ? colors.onBrandFilled : colors.navy,
            border: `1px solid ${selected ? colors.navy : colors.border}`,
          }}
        >
          {step}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 800,
              color: colors.navy,
              lineHeight: 1.25,
            }}
          >
            {title}
          </Typography>
        </Box>

        {summary}

        <ChevronDown
          size={18}
          color={colors.textMuted}
          aria-hidden
          style={{
            flexShrink: 0,
            transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.15s',
          }}
        />
      </Box>

      {!expanded && collapsedHint ? (
        <Box
          sx={{
            px: 1.5,
            py: 1,
            bgcolor: colors.surface,
            borderTop: `1px solid ${colors.borderSoft}`,
          }}
        >
          {collapsedHint}
        </Box>
      ) : null}

      {expanded && children ? (
        <Box
          sx={{
            bgcolor: colors.white,
            flex: fillAvailableHeight ? 1 : undefined,
            minHeight: fillAvailableHeight ? 0 : undefined,
            overflowY: fillAvailableHeight ? 'auto' : undefined,
          }}
        >
          {children}
        </Box>
      ) : null}
    </Box>
  )
}

export function drawerNavSummaryPill(
  label: string,
  colors: ReturnType<typeof usePublicBrandColors>,
  variant: DrawerNavSummaryVariant,
) {
  return (
    <Box
      component="span"
      sx={{
        flexShrink: 0,
        px: 1,
        py: 0.25,
        borderRadius: '6px',
        fontSize: 10,
        fontWeight: 800,
        lineHeight: 1.4,
        bgcolor:
          variant === 'complete'
            ? colors.greenMuted
            : variant === 'progress'
              ? 'rgba(245, 158, 11, 0.12)'
              : colors.surfaceAlt,
        color:
          variant === 'complete'
            ? colors.greenDark
            : variant === 'progress'
              ? '#B45309'
              : colors.textMuted,
      }}
    >
      {label}
    </Box>
  )
}
