import { Box, Stack, Typography } from '@mui/material'
import { FileText, FolderOpen } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  focusRingSx,
} from '@/pages/website/theme/applyFlowTheme'

const ITEMS = [
  { to: '/retail/account', label: 'Applications', icon: FileText, end: true },
  { to: '/retail/account/documents', label: 'My Documents', icon: FolderOpen, end: false },
] as const

/**
 * Two links, no identity strip — profile sits in the card above this and is not a
 * destination. Deliberately not an enterprise sidebar: no collapse, nesting, or headers.
 */
export function RetailAccountNav({ documentCount }: { documentCount: number }) {
  return (
    <Stack
      component="nav"
      sx={{
        p: 1,
        borderRadius: applyRadius.card,
        bgcolor: applyFlow.surface,
        border: `1px solid ${applyFlow.hairline}`,
      }}
    >
      {ITEMS.map(item => {
        const Icon = item.icon
        return (
          <NavLink key={item.to} to={item.to} end={item.end} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.25}
                sx={{
                  px: 1.5,
                  py: 1.15,
                  borderRadius: applyRadius.control,
                  bgcolor: isActive ? applyFlow.accentSoft : 'transparent',
                  color: isActive ? applyFlow.ink : applyFlow.inkMuted,
                  transition: `background-color 140ms ${applyMotion.easeOut}, color 140ms ${applyMotion.easeOut}`,
                  '@media (hover: hover) and (pointer: fine)': {
                    '&:hover': {
                      bgcolor: isActive ? applyFlow.accentSoft : applyFlow.canvas,
                      color: applyFlow.ink,
                    },
                  },
                  ...focusRingSx,
                }}
              >
                <Icon size={15} color={isActive ? applyFlow.accentInk : applyFlow.inkFaint} />
                <Typography
                  sx={{ flex: 1, fontSize: 13.5, fontWeight: isActive ? 700 : 600, minWidth: 0 }}
                  noWrap
                >
                  {item.label}
                </Typography>
                {item.to.endsWith('/documents') && documentCount > 0 ? (
                  <Box
                    component="span"
                    sx={{
                      fontFamily: applyFont.mono,
                      fontSize: 11,
                      color: applyFlow.inkFaint,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {documentCount}
                  </Box>
                ) : null}
              </Stack>
            )}
          </NavLink>
        )
      })}
    </Stack>
  )
}
