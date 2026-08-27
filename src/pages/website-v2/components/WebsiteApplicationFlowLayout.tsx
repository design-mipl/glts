import { Box } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { brandPrimaryGreenRgb, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { PublicContainer } from './PublicContainer'
import { WebsiteApplyHeader } from './WebsiteApplyHeader'
import { publicFonts } from '../theme/publicSiteTokens'

interface WebsiteApplicationFlowLayoutProps {
  children: ReactNode
}

const GRID_SIZE_PX = 40

/**
 * Focused retail apply shell — minimal header, no marketing nav,
 * no site footer / sticky CTA. Graph-paper canvas behind the flow.
 */
export function WebsiteApplicationFlowLayout({ children }: WebsiteApplicationFlowLayoutProps) {
  const colors = usePublicBrandColors()
  const gridLine = `rgba(${brandPrimaryGreenRgb}, 0.07)`
  const canvasTint = alpha(colors.greenBright, 0.02)
  const gridSize = `${GRID_SIZE_PX}px ${GRID_SIZE_PX}px`

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        minHeight: '100vh',
        width: '100%',
        fontFamily: publicFonts.body,
        color: colors.text,
        bgcolor: colors.surface,
        overflow: 'hidden',
      }}
    >
      <WebsiteApplyHeader />
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: 3, md: 4 },
          pb: { xs: 5, md: 6 },
          minHeight: 0,
          boxSizing: 'border-box',
          bgcolor: colors.surface,
          backgroundImage: [
            // Horizontal lines
            `linear-gradient(${gridLine} 1px, transparent 1px)`,
            // Vertical lines
            `linear-gradient(90deg, ${gridLine} 1px, transparent 1px)`,
            // Soft green wash
            `linear-gradient(${canvasTint}, ${canvasTint})`,
          ].join(', '),
          // One size per layer — both grid axes must tile at GRID_SIZE_PX
          backgroundSize: `${gridSize}, ${gridSize}, auto`,
          backgroundPosition: 'top left, top left, center',
          backgroundRepeat: 'repeat, repeat, no-repeat',
          backgroundAttachment: 'scroll',
        }}
      >
        <PublicContainer
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            width: '100%',
          }}
        >
          {children}
        </PublicContainer>
      </Box>
    </Box>
  )
}
