import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

interface DrawerSidebarSectionProps {
  title: string
  summary?: ReactNode
  selected?: boolean
  onHeaderClick?: () => void
  children?: ReactNode
}

export function DrawerSidebarSection({
  title,
  summary,
  selected = false,
  onHeaderClick,
  children,
}: DrawerSidebarSectionProps) {
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        overflow: 'hidden',
        outline: selected ? `2px solid ${colors.navy}` : 'none',
        outlineOffset: -1,
      }}
    >
      <Box
        role={onHeaderClick ? 'button' : undefined}
        tabIndex={onHeaderClick ? 0 : undefined}
        onClick={onHeaderClick}
        onKeyDown={
          onHeaderClick
            ? e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onHeaderClick()
                }
              }
            : undefined
        }
        sx={{
          px: 1.5,
          py: 1,
          bgcolor: colors.surfaceAlt,
          borderBottom: children ? `1px solid ${colors.border}` : 'none',
          cursor: onHeaderClick ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 800, color: colors.navy }}>{title}</Typography>
        {summary}
      </Box>
      {children}
    </Box>
  )
}
