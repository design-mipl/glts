import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { PublicHeader } from './PublicHeader'
import { FooterSection } from '../pages/LandingPage/components/FooterSection'
import { MobileStickyCta } from './MobileStickyCta'
import { publicFonts } from '../theme/publicSiteTokens'
import { useLenis } from '../hooks/useLenis'

interface PublicLayoutProps {
  children: ReactNode
  hideFooter?: boolean
}

export function PublicLayout({ children, hideFooter = false }: PublicLayoutProps) {
  useLenis()
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        fontFamily: publicFonts.body,
        color: '#0F172A',
        bgcolor: '#fff',
      }}
    >
      <PublicHeader />
      <Box component="main" sx={{ flex: 1, width: '100%' }}>
        {children}
      </Box>
      {!hideFooter && <FooterSection />}
      <MobileStickyCta />
    </Box>
  )
}
