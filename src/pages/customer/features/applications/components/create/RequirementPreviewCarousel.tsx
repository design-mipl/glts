import { useState } from 'react'
import { Box, Typography, Card, Stack, Chip, IconButton, Button, Grid } from '@mui/material'
import { ChevronLeft, ChevronRight, Eye, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { RequirementPreviewCard } from '../../data/singleApplicationFlowData'

interface RequirementPreviewCarouselProps {
  cards: RequirementPreviewCard[]
}

export function RequirementPreviewCarousel({ cards }: RequirementPreviewCarouselProps) {
  const colors = usePublicBrandColors()
  const [index, setIndex] = useState(0)

  if (cards.length === 0) {
    return (
      <Card
        sx={{
          p: 2.5,
          borderRadius: '14px',
          border: `1px solid ${colors.border}`,
          bgcolor: colors.surface,
        }}
      >
        <Typography sx={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 1.5 }}>
          Requirement preview is unavailable until a visa type and purpose are selected on the previous step.
        </Typography>
      </Card>
    )
  }

  const safeIndex = Math.min(index, cards.length - 1)
  const card = cards[safeIndex]

  const go = (delta: number) => {
    setIndex(i => Math.max(0, Math.min(cards.length - 1, i + delta)))
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <IconButton size="small" onClick={() => go(-1)} disabled={safeIndex === 0} aria-label="Previous requirement card">
          <ChevronLeft size={20} />
        </IconButton>
        <Stack direction="row" spacing={0.75}>
          {cards.map((c, i) => (
            <Box
              key={c.id}
              sx={{
                width: i === safeIndex ? 24 : 8,
                height: 8,
                borderRadius: '4px',
                bgcolor: i === safeIndex ? colors.greenBright : colors.surfaceAlt,
                transition: 'width 200ms ease',
              }}
            />
          ))}
        </Stack>
        <IconButton
          size="small"
          onClick={() => go(1)}
          disabled={safeIndex === cards.length - 1}
          aria-label="Next requirement card"
        >
          <ChevronRight size={20} />
        </IconButton>
      </Stack>

      <Card
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: '14px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
          minHeight: card.variant === 'glts' ? 0 : 280,
        }}
      >
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1} sx={{ mb: 1.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '16px', color: colors.navy }}>{card.title}</Typography>
            {card.arrangedBy && (
              <Chip
                label={`Arranged by: ${card.arrangedBy}`}
                size="small"
                sx={{ mt: 1, height: 22, fontSize: 11, fontWeight: 700, bgcolor: colors.surfaceAlt }}
              />
            )}
          </Box>
          <Typography sx={{ fontSize: 12, color: colors.textMuted, fontWeight: 600 }}>
            {safeIndex + 1} / {cards.length}
          </Typography>
        </Stack>

        {card.alertNote && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 2,
              p: 1.25,
              borderRadius: '10px',
              bgcolor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.28)',
            }}
          >
            <AlertTriangle size={16} color="#B45309" style={{ flexShrink: 0, marginTop: 2 }} />
            <Typography sx={{ fontSize: 12, color: '#92400E', lineHeight: 1.45 }}>{card.alertNote}</Typography>
          </Stack>
        )}

        {card.documents && (
          <Stack spacing={1}>
            {card.documents.map(doc => (
              <Stack
                key={doc.id}
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  py: 1,
                  px: 1.25,
                  borderRadius: '10px',
                  border: `1px solid ${colors.border}`,
                  bgcolor: colors.surface,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap">
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.navy }}>{doc.name}</Typography>
                    <Chip
                      label={doc.mandatory ? 'Mandatory' : 'Optional'}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 10,
                        fontWeight: 700,
                        bgcolor: doc.mandatory ? colors.greenMuted : colors.surfaceAlt,
                        color: doc.mandatory ? colors.greenDark : colors.textMuted,
                      }}
                    />
                  </Stack>
                  {doc.remarks && (
                    <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.25 }}>{doc.remarks}</Typography>
                  )}
                </Box>
                {doc.hasSample && (
                  <Button startIcon={<Eye size={14} />} sx={{ textTransform: 'none' }}>
                    Sample
                  </Button>
                )}
                <Chip label="Guidance only" size="small" variant="outlined" sx={{ height: 22, fontSize: 10 }} />
              </Stack>
            ))}
          </Stack>
        )}

        {card.scopeItems && card.variant === 'glts' && (
          <GltsScopePanel items={card.scopeItems} colors={colors} />
        )}

        {card.scopeItems && card.variant !== 'glts' && (
          <Stack spacing={1}>
            {card.scopeItems.map(item => (
              <Stack key={item} direction="row" spacing={1} alignItems="center">
                <CheckCircle2 size={16} color={colors.greenBright} />
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.navy }}>{item}</Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Card>

      <Typography sx={{ fontSize: 11, color: colors.textMuted, textAlign: 'center', mt: 1 }}>
        Use arrows to navigate requirement groups · Swipe on mobile
      </Typography>
    </Box>
  )
}

function GltsScopePanel({
  items,
  colors,
}: {
  items: string[]
  colors: ReturnType<typeof usePublicBrandColors>
}) {
  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          px: 1.25,
          py: 1,
          borderRadius: '10px',
          bgcolor: colors.greenMuted,
          border: `1px solid ${colors.greenBright}33`,
        }}
      >
        <Sparkles size={16} color={colors.greenBright} />
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.greenDark, lineHeight: 1.4 }}>
          GLTS manages the full application lifecycle for this visa.
        </Typography>
      </Stack>

      <Grid container spacing={1}>
        {items.map((item, i) => (
          <Grid size={{ xs: 12, sm: 6 }} key={item}>
            <Stack
              direction="row"
              alignItems="flex-start"
              spacing={1}
              sx={{
                height: '100%',
                p: 1.25,
                borderRadius: '10px',
                border: `1px solid ${colors.border}`,
                bgcolor: colors.surface,
              }}
            >
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '6px',
                  bgcolor: colors.greenMuted,
                  color: colors.greenDark,
                  fontSize: 11,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.navy, lineHeight: 1.35, minWidth: 0 }}>
                {item}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
