import { Box, Typography, Button, Card } from '@mui/material'
import { Construction, ArrowRight } from 'lucide-react'
import {
  publicFonts,
  publicLayout,
  publicShadows,
  publicTypography,
  usePublicBrandColors,
  getPrimaryButtonSx,
} from '../theme/publicBrand'

interface ComingSoonPageProps {
  title?: string
  description?: string
  returnLink?: { text: string; href: string }
}

export function ComingSoonPage({
  title = 'Coming Soon',
  description = 'This page is under development. Check back soon!',
  returnLink = { text: 'Back to Home', href: '/' },
}: ComingSoonPageProps) {
  const colors = usePublicBrandColors()
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        py: publicLayout.sectionMajor,
        px: 3,
        bgcolor: colors.surface,
        fontFamily: publicFonts.body,
      }}
    >
      <Card
        sx={{
          p: { xs: 5, md: 8 },
          maxWidth: 520,
          width: '100%',
          textAlign: 'center',
          borderRadius: publicLayout.cardRadius,
          border: `1px solid ${colors.border}`,
          boxShadow: publicShadows.card,
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '18px',
            bgcolor: colors.greenMuted,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 4,
          }}
        >
          <Construction size={36} color={colors.greenBright} />
        </Box>
        <Typography
          sx={{
            fontFamily: publicFonts.heading,
            fontWeight: 800,
            fontSize: publicTypography.h2,
            color: colors.navy,
            mb: 2,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: colors.textSecondary,
            fontSize: publicTypography.bodyLg,
            lineHeight: 1.75,
            mb: 4,
          }}
        >
          {description}
        </Typography>
        <Button
          variant="contained"
          href={returnLink.href}
          endIcon={<ArrowRight size={18} />}
          sx={{ ...getPrimaryButtonSx(colors), px: 4, py: 1.5 }}
        >
          {returnLink.text}
        </Button>
      </Card>
    </Box>
  )
}
