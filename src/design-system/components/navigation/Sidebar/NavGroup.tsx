import { Box, Typography, Collapse, Popper, Paper } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
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
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [flyoutOpen, setFlyoutOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  // Section label group (no icon) — just a label + children
  if (!icon) {
    return (
      <Box>
        {!collapsed && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              fontSize: tokens.fontSize.xs,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'text.secondary',
              px: '20px',
              pt: '16px',
              pb: '4px',
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

  // Collapsible group with icon (sub-category parent)
  if (collapsed) {
    // In collapsed mode: show parent icon with flyout
    return (
      <Box>
        <Box
          ref={anchorRef}
          onMouseEnter={() => setFlyoutOpen(true)}
          onMouseLeave={() => setFlyoutOpen(false)}
          sx={{ display: 'flex', justifyContent: 'center', py: 0.25 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: tokens.borderRadius.md,
              cursor: 'pointer',
              color: 'text.secondary',
              fontSize: 20,
              mx: '8px',
              transition: `background-color ${tokens.transition.normal}`,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                color: 'text.primary',
              },
            }}
          >
            {icon}
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
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                px: 2,
                pt: 0.5,
                pb: 0.25,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'text.secondary',
                fontSize: 11,
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
          gap: '12px',
          px: '12px',
          mx: '8px',
          height: '40px',
          borderRadius: tokens.borderRadius.md,
          cursor: 'pointer',
          color: 'text.secondary',
          transition: `background-color ${tokens.transition.normal}`,
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            color: 'text.primary',
          },
          userSelect: 'none',
        }}
      >
        <Box sx={{ fontSize: 20, display: 'flex', flexShrink: 0, color: 'inherit' }}>
          {icon}
        </Box>
        <Typography
          variant="body2"
          fontWeight={400}
          color="inherit"
          sx={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {label}
        </Typography>
        {badge !== undefined && (
          <Box
            sx={{
              fontSize: 11, fontWeight: 600, bgcolor: 'primary.main', color: '#fff',
              borderRadius: '9999px', px: 0.75, py: 0.125, lineHeight: 1.4,
            }}
          >
            {badge}
          </Box>
        )}
        <ExpandMoreIcon
          sx={{
            fontSize: 18,
            flexShrink: 0,
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
