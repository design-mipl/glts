import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

interface SimpleDocumentRequirementCardProps {
  children: ReactNode
}

export function SimpleDocumentRequirementCard({ children }: SimpleDocumentRequirementCardProps) {
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '10px',
        border: `1px solid ${colors.border}`,
        bgcolor: colors.surface,
      }}
    >
      {children}
    </Box>
  )
}
