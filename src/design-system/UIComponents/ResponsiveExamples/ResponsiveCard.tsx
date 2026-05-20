import { Card, CardContent, Typography } from '@mui/material'
import { useResponsiveValue } from '../../hooks/useResponsiveValue'
import { RESPONSIVE_CARD_PADDING } from '../../tokens'

export default function ResponsiveCard() {
  const pad = useResponsiveValue([...RESPONSIVE_CARD_PADDING].map((n) => `${n}px`))

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          Card padding tier
        </Typography>
        <Typography variant="body2" color="text.secondary">
          MuiCardContent padding this breakpoint: {pad}
        </Typography>
      </CardContent>
    </Card>
  )
}
