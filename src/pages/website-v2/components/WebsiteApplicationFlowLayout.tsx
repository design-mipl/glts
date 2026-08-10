import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getPortalPageCanvasBackground } from '@/shared/theme/portalPageCanvasLayout'
import { PublicHeader } from './PublicHeader'
import { PublicContainer } from './PublicContainer'
import { publicFonts } from '../theme/publicSiteTokens'

interface WebsiteApplicationFlowLayoutProps {
  children: ReactNode
}

/** Public website application wizard — header only, no sidebar, footer, or sticky CTA. */
export function WebsiteApplicationFlowLayout({ children }: WebsiteApplicationFlowLayoutProps) {
  const theme = useTheme()
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        fontFamily: publicFonts.body,
        color: '#0F172A',
        bgcolor: colors.surface,
      }}
    >
      <PublicHeader />
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          py: { xs: 2.5, md: 3.5 },
          minHeight: '100%',
          boxSizing: 'border-box',
          bgcolor: colors.surface,
          backgroundImage: getPortalPageCanvasBackground(theme, colors),
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundAttachment: 'scroll',
        }}
      >
        <PublicContainer>{children}</PublicContainer>
      </Box>
    </Box>
  )
}