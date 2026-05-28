import { Box, Typography } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

export function PlaceholderPage({ title }: { title: string }) {
  const colors = usePublicBrandColors()
  return (
    <Box>
      <Typography sx={{ fontWeight: 800, fontSize: '20px', color: colors.navy }}>{title}</Typography>
    </Box>
  )
}
