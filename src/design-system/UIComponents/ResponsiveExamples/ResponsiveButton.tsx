import { Box, Typography } from '@mui/material'
import { useResponsiveValue } from '../../hooks/useResponsiveValue'
import { RESPONSIVE_BUTTON_PADDING } from '../../tokens'
import Button from '../Primitives/Button'

/** Demo: density-driven padding labels from responsive token tier. */
export default function ResponsiveButton() {
  const pad = useResponsiveValue(RESPONSIVE_BUTTON_PADDING.medium.map(([y, x]) => `${y}px × ${x}px`))

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Medium button padding this tier: {pad}
      </Typography>
      <Button label="Responsive density" variant="contained" size="md" />
    </Box>
  )
}
