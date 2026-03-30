import { Box, Typography, Button } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import LockIcon from '@mui/icons-material/Lock'
import type { ReactNode } from 'react'

export interface EmptyStateProps {
  variant?: 'no-data' | 'no-results' | 'no-access'
  title?: string
  description?: string
  action?: { label: string; onClick: () => void }
  icon?: ReactNode
}

const DEFAULTS = {
  'no-data': {
    title: 'No data yet',
    description: 'Add your first record to get started',
    Icon: InboxIcon,
  },
  'no-results': {
    title: 'No results found',
    description: 'Try adjusting your search or filters',
    Icon: SearchOffIcon,
  },
  'no-access': {
    title: 'Access restricted',
    description: "You don't have permission to view this",
    Icon: LockIcon,
  },
}

export default function EmptyState({
  variant = 'no-results',
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  const def = DEFAULTS[variant]
  const Icon = def.Icon

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        gap: 1,
      }}
    >
      <Box sx={{ color: 'text.disabled', mb: 1 }}>
        {icon ?? <Icon sx={{ fontSize: 48 }} />}
      </Box>
      <Typography variant="subtitle1" fontWeight={600} color="text.primary" textAlign="center">
        {title ?? def.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {description ?? def.description}
      </Typography>
      {action && (
        <Button variant="contained" size="small" sx={{ mt: 1 }} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
  )
}
