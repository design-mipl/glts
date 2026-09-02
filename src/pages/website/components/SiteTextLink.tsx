import { Box } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { useSiteTone } from './siteTone'
import { site, siteFont, siteMotion, siteRadius } from '@/pages/website/theme/siteTheme'

/** Quiet secondary action — hairline, never a second filled button competing with the CTA. */
export function SiteTextLink({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
}) {
  const t = useSiteTone()

  return (
    <Box
      component={href ? 'a' : 'button'}
      type={href ? undefined : 'button'}
      href={href}
      onClick={onClick}
      sx={{
        appearance: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
        px: 3.5,
        minHeight: 42,
        '@media (pointer: coarse)': { minHeight: 44 },
        borderRadius: siteRadius.control,
        border: `1px solid ${t.hairlineStrong}`,
        backgroundColor: 'transparent',
        color: t.text,
        textDecoration: 'none',
        fontFamily: siteFont.body,
        fontSize: 13.5,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        transition: `border-color 150ms ${siteMotion.easeOut}, background-color 150ms ${siteMotion.easeOut}`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': { borderColor: t.accentBorder, backgroundColor: t.surfaceRaised },
          '&:hover .linkArrow': { transform: 'translateX(3px)' },
        },
        '&:active': { transform: 'scale(0.98)' },
        '&:focus-visible': {
          outline: 'none',
          borderColor: t.accent,
          boxShadow: `0 0 0 3px ${site.accentRing}`,
        },
      }}
    >
      {children}
      <Box
        component="span"
        className="linkArrow"
        sx={{ display: 'inline-flex', transition: `transform 180ms ${siteMotion.easeOut}` }}
      >
        <ArrowRight size={15} />
      </Box>
    </Box>
  )
}
