import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { IconButton } from '@/design-system/UIComponents'

interface PricingCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  onEdit?: () => void
  onDelete?: () => void
  readOnly?: boolean
}

export function PricingCard({
  title,
  subtitle,
  children,
  footer,
  onEdit,
  onDelete,
  readOnly,
}: PricingCardProps) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 14 }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mt: 0.25 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {!readOnly && (onEdit || onDelete) ? (
          <Stack direction="row" spacing={0.5}>
            {onEdit ? (
              <IconButton tooltip="Edit" size="sm" variant="soft" icon={<Pencil size={14} />} onClick={onEdit} />
            ) : null}
            {onDelete ? (
              <IconButton tooltip="Delete" size="sm" variant="soft" icon={<Trash2 size={14} />} onClick={onDelete} />
            ) : null}
          </Stack>
        ) : null}
      </Stack>
      <Box sx={{ px: 2, py: 1.5 }}>{children}</Box>
      {footer ? (
        <Box sx={{ px: 2, py: 1.25, borderTop: 1, borderColor: 'divider', bgcolor: 'action.hover' }}>
          {footer}
        </Box>
      ) : null}
    </Box>
  )
}
