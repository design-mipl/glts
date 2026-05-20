import { Box, Typography } from '@mui/material'
import { useResponsiveValue } from '../../hooks/useResponsiveValue'
import { RESPONSIVE_INPUT_HEIGHT } from '../../tokens'
import Input from '../Primitives/Input'

export default function ResponsiveInput() {
  const h = useResponsiveValue([...RESPONSIVE_INPUT_HEIGHT].map((n) => `${n}px`))

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Theme input min-height this tier: {h}
      </Typography>
      <Input placeholder="Outlined field" />
    </Box>
  )
}
