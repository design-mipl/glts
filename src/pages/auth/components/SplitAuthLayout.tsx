import { Box, Typography, Button, Stack } from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'

/** Travel-industry hero imagery (corporate / aviation / airport) */
const HERO_IMAGES = {
  business:
    'https://images.unsplash.com/photo-1436491865339-7a61a109cc05?auto=format&fit=crop&w=1200&h=1600&q=80',
  operations:
    'https://images.unsplash.com/photo-1556388158-158f06d4bd81?auto=format&fit=crop&w=1200&h=1600&q=80',
} as const

const HERO_FALLBACK = {
  business:
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=1600&q=80',
  operations:
    'https://images.unsplash.com/photo-1570168007207-a0e90bb4cde2?auto=format&fit=crop&w=1200&h=1600&q=80',
}

interface SplitAuthLayoutProps {
  variant: 'business' | 'operations'
  headline: string
  subline: string
  children: ReactNode
}

export function SplitAuthLayout({ variant, headline, subline, children }: SplitAuthLayoutProps) {
  const colors = usePublicBrandColors()
  const img = HERO_IMAGES[variant]
  const fallback = HERO_FALLBACK[variant]

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: colors.surface }}>
      {/* Left — branding */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: { md: '42%', lg: '45%' },
          position: 'relative',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={img}
          alt=""
          onError={e => {
            const t = e.target as HTMLImageElement
            t.src = fallback
          }}
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, rgba(0,31,63,0.55) 0%, rgba(0,31,63,0.88) 70%, ${colors.navy} 100%)`,
          }}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ position: 'relative', zIndex: 1, p: 3 }}
        >
          <Box component="a" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="img" src="/greenlight_logo.jpg" alt="Greenlight" sx={{ height: 36, borderRadius: '8px' }} />
          </Box>
          <Button
            component="a"
            href="/"
            startIcon={<ArrowLeft size={16} />}
            sx={{
              color: 'rgba(255,255,255,0.9)',
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 600,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            Back to website
          </Button>
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Box sx={{ position: 'relative', zIndex: 1, p: 4, pb: 5 }}>
          <Typography
            sx={{
              fontFamily: publicFonts.heading,
              fontWeight: 800,
              fontSize: { md: '28px', lg: '34px' },
              color: '#fff',
              lineHeight: 1.2,
              mb: 2,
              maxWidth: 420,
            }}
          >
            {headline}
          </Typography>
          <Typography sx={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, maxWidth: 400, mb: 0 }}>
            {subline}
          </Typography>
          <Box sx={{ mt: 4, width: 48, height: 3, borderRadius: 2, bgcolor: colors.greenBright }} />
        </Box>
      </Box>

      {/* Right — form area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
          bgcolor: '#F3F4F6',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>{children}</Box>
      </Box>
    </Box>
  )
}
