import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'
import { useResponsiveValue } from '../../hooks/useResponsiveValue'
import { RESPONSIVE_SPACING } from '../../tokens'

export default function ResponsiveListItem() {
  const py = useResponsiveValue([...RESPONSIVE_SPACING.sm])

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        List vertical rhythm (MUI spacing units from RESPONSIVE_SPACING.sm): {py}
      </Typography>
      <List dense sx={{ py: 0 }}>
        {['Alpha', 'Beta', 'Gamma'].map((label) => (
          <ListItem key={label} sx={{ py }}>
            <ListItemText primary={label} secondary="Responsive py from RESPONSIVE_SPACING.sm" />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
