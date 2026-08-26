import { Box, Button, Drawer, IconButton, Stack, Typography } from '@mui/material'
import { X } from 'lucide-react'
import type { DocumentWhyContent } from '../config/documentWhyContent'
import { usePublicBrandColors, publicFonts } from '@/shared/theme/publicBrand'

interface WhyWeAskSheetProps {
  open: boolean
  content: DocumentWhyContent | null
  onClose: () => void
}

/** Slide-over explaining why a document/detail is required (Corridor-style trust). */
export function WhyWeAskSheet({ open, content, onClose }: WhyWeAskSheetProps) {
  const colors = usePublicBrandColors()

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100%',
          bgcolor: colors.white,
          borderLeft: `1px solid ${colors.border}`,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 2,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Typography
          sx={{
            fontFamily: publicFonts.heading,
            fontWeight: 800,
            fontSize: '16px',
            color: colors.navy,
          }}
        >
          Why we ask
        </Typography>
        <IconButton aria-label="Close" onClick={onClose} size="small" sx={{ color: colors.textSecondary }}>
          <X size={18} />
        </IconButton>
      </Box>

      {content ? (
        <Stack spacing={2.5} sx={{ p: 2.5, flex: 1 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 800, color: colors.navy, lineHeight: 1.3 }}>
            {content.title}
          </Typography>

          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              bgcolor: colors.surface,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: colors.textMuted,
                mb: 1,
              }}
            >
              Why they ask for it
            </Typography>
            <Typography sx={{ fontSize: '14px', color: colors.text, lineHeight: 1.6 }}>{content.why}</Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              bgcolor: colors.greenMuted,
              border: `1px solid rgba(115, 192, 100, 0.28)`,
            }}
          >
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: colors.greenDark,
                mb: 1,
              }}
            >
              What it has to look like
            </Typography>
            <Typography sx={{ fontSize: '14px', color: colors.text, lineHeight: 1.6 }}>{content.format}</Typography>
          </Box>

          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              mt: 'auto',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '13px',
              borderRadius: '10px',
              bgcolor: colors.greenBright,
              color: colors.onBrandFilled,
              '&:hover': { bgcolor: colors.greenDark },
            }}
          >
            Got it
          </Button>
        </Stack>
      ) : null}
    </Drawer>
  )
}
