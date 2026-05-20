import { Box, Typography, Collapse, Popper, Paper } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState, useRef } from 'react'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'

export interface NavGroupProps {
  label: string
  icon?: ReactNode
  children: ReactNode
  defaultExpanded?: boolean
  collapsed?: boolean
  badge?: number
}

export default function NavGroup({
  label,
  icon,
  children,
  defaultExpanded = true,
  collapsed = false,
  badge,
}: NavGroupProps) {
  const theme = useTheme()
  const navigation = theme.foundation.navigation
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [flyoutOpen, setFlyoutOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  // Section label group (no icon) — just a label + children
  if (!icon) {
    return (
      <Box>
        {!collapsed && (
          <Typography
            sx={{
              display: 'block',
              fontSize: '10.5px',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: alpha(navigation.textPrimary, 0.42),
              px: '16px',
              pt: '20px',
              pb: '2px',
            }}
          >
            {label}
          </Typography>
        )}
        {collapsed && <Box sx={{ pt: 1 }} />}
        {children}
      </Box>
    )
  }

  // Collapsible group with icon — collapsed mode: flyout
  if (collapsed) {
    return (
      <Box>
        <Box
          ref={anchorRef}
          onMouseEnter={() => setFlyoutOpen(true)}
          onMouseLeave={() => setFlyoutOpen(false)}
          sx={{ display: 'flex', justifyContent: 'center', py: '1px' }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: tokens.borderRadius.md,
              cursor: 'pointer',
              color: navigation.textSecondary,
              mx: '8px',
              transition: 'background-color 150ms ease',
              '&:hover': {
                bgcolor: navigation.hover,
                color: navigation.textPrimary,
              },
            }}
          >
            <Box sx={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {icon}
            </Box>
          </Box>
        </Box>
        <Popper
          open={flyoutOpen}
          anchorEl={anchorRef.current}
          placement="right-start"
          sx={{ zIndex: 1200 }}
          onMouseEnter={() => setFlyoutOpen(true)}
          onMouseLeave={() => setFlyoutOpen(false)}
        >
          <Paper
            elevation={4}
            sx={{
              ml: 1,
              py: 0.5,
              minWidth: 180,
              borderRadius: tokens.borderRadius.md,
              border: '1px solid',
              borderColor: navigation.border,
              bgcolor: navigation.background,
              color: navigation.textPrimary,
            }}
          >
            <Typography
              sx={{
                display: 'block',
                px: 2,
                pt: 0.5,
                pb: 0.25,
                fontSize: '10.5px',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: alpha(navigation.textPrimary, 0.42),
              }}
            >
              {label}
            </Typography>
            {children}
          </Paper>
        </Popper>
      </Box>
    )
  }

  // Expanded mode: collapsible with header
  return (
    <Box>
      <Box
        onClick={() => setExpanded(e => !e)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          px: '10px',
          mx: '8px',
          height: '32px',
          borderRadius: tokens.borderRadius.md,
          cursor: 'pointer',
          color: navigation.textSecondary,
          my: '1px',
          transition: 'background-color 150ms ease',
          '&:hover': {
            bgcolor: navigation.hover,
            color: navigation.textPrimary,
          },
          userSelect: 'none',
        }}
      >
        <Box sx={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'inherit' }}>
          {icon}
        </Box>
        <Typography
          sx={{
            fontSize: '13px',
            fontWeight: 450,
            lineHeight: 1,
            flex: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: 'inherit',
          }}
        >
          {label}
        </Typography>
        {badge !== undefined && (
          <Box
            sx={{
              minWidth: 16,
              height: 16,
              fontSize: '10px',
              fontWeight: 600,
              borderRadius: '8px',
              px: '4px',
              lineHeight: '16px',
              bgcolor: alpha(navigation.textPrimary, 0.08),
              color: navigation.textPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {badge}
          </Box>
        )}
        <ExpandMoreIcon
          sx={{
            fontSize: 14,
            flexShrink: 0,
            color: 'inherit',
            transition: `transform ${tokens.transition.normal}`,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </Box>
      <Collapse in={expanded} timeout={200}>
        {children}
      </Collapse>
    </Box>
  )
}
