import { Box, useMediaQuery, useTheme } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui'
import { paper } from '../theme/sitePaper'

/**
 * Sticky mobile call to action.
 *
 * Two defects fixed here, both of them invisible in code review and obvious on a phone.
 *
 * CONTRAST. The button filled with `greenBright` (`#73C064`) and took MUI's default white
 * label — about 2.2:1, well under the 4.5:1 floor, on the single most prominent control on
 * the mobile site. It now uses the shared `Button`, whose `default` variant is the deep
 * `green.action` with a white label at ~6.4:1. Raw brand green is a fill behind dark text
 * or a tint; it is never a background for white type.
 *
 * BREAKPOINT. The visibility test was `breakpoints.down('md')`, and `md` in this project is
 * 428px — so the bar vanished on any phone wider than an iPhone 14, which is most of them.
 * `lg` (600px) is the real phone/tablet boundary here.
 */
export function MobileStickyCta() {
  const theme = useTheme()
  const isCompact = useMediaQuery(theme.breakpoints.down('lg'))

  if (!isCompact) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1090,
        p: 2,
        pb: 'max(16px, env(safe-area-inset-bottom))',
        background: `linear-gradient(to top, ${paper.base} 68%, transparent)`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Button asChild size="lg" className="gl-sticky-cta" sx={{ width: '100%' }}>
        <Link to="/countries">
          Start application
          <Box
            component="span"
            aria-hidden
            sx={{
              display: 'inline-flex',
              transition: 'transform 180ms cubic-bezier(0.23, 1, 0.32, 1)',
              '.gl-sticky-cta:hover &': { transform: 'translateX(3px)' },
              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            }}
          >
            <ArrowRight size={18} />
          </Box>
        </Link>
      </Button>
    </Box>
  )
}
