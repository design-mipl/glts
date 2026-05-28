import { Alert, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { TEMPLATE_SHOWCASE_BASE } from '../config/templateRegistry'

interface TemplateShowcaseBannerProps {
  components: string[]
}

export function TemplateShowcaseBanner({ components }: TemplateShowcaseBannerProps) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Alert severity="info" sx={{ alignItems: 'flex-start' }}>
        Live template demo — wired to production components ({components.join(', ')}). Changes to the design
        system update this page automatically.{' '}
        <RouterLink to={TEMPLATE_SHOWCASE_BASE}>All templates</RouterLink>
      </Alert>
    </Box>
  )
}
