import { Box, Stack, Typography } from '@mui/material'
import { ArrowRight, Clock, FileText } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'
import { publicShadows, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { PORTAL_HELP_ARTICLES } from '../data/portalHelpArticles'

function formatArticleDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function HelpSupportArticlesSection() {
  const colors = usePublicBrandColors()

  return (
    <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        {PORTAL_HELP_ARTICLES.map(article => (
          <Box
            key={article.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
              borderRadius: BORDER_RADIUS.lg,
              bgcolor: colors.white,
              boxShadow: publicShadows.card,
              overflow: 'hidden',
              transition: 'box-shadow 150ms, border-color 150ms',
              '&:hover': {
                borderColor: 'rgba(59, 130, 246, 0.35)',
                boxShadow: '0 4px 16px rgba(15, 38, 92, 0.08)',
              },
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ p: 2, pb: 1.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: BORDER_RADIUS.lg,
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  color: '#2563EB',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <FileText size={20} strokeWidth={1.75} />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.navy, lineHeight: 1.35 }}>
                  {article.title}
                </Typography>
                <Box sx={{ mt: 0.75 }}>
                  <CustomerStatusChip label={article.category} tone="info" />
                </Box>
              </Box>
            </Stack>

            <Typography sx={{ px: 2, fontSize: 13, color: colors.textSecondary, lineHeight: 1.6, flex: 1 }}>
              {article.description}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={1}
              sx={{ px: 2, py: 1.5, mt: 1.5, borderTop: `1px solid ${colors.border}` }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Clock size={13} color={colors.textMuted} />
                  <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
                    {article.readingTimeMinutes} min read
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
                  Updated {formatArticleDate(article.lastUpdated)}
                </Typography>
              </Stack>
              <Button type="button" variant="outlined" endIcon={<ArrowRight size={14} />}>
                Read article
              </Button>
            </Stack>
          </Box>
        ))}
    </Box>
  )
}
