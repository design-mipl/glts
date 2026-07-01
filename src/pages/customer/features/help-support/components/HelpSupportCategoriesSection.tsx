import { Box, Typography } from '@mui/material'
import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'
import { publicShadows, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { PORTAL_SUPPORT_CATEGORIES } from '../data/portalSupportCategories'

export function HelpSupportCategoriesSection() {
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
        gap: 1.5,
      }}
    >
      {PORTAL_SUPPORT_CATEGORIES.map(category => {
        const Icon = category.icon
        return (
          <Box
            key={category.id}
            component="button"
            type="button"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 1.25,
              p: 2,
              textAlign: 'left',
              border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
              borderRadius: BORDER_RADIUS.lg,
              bgcolor: colors.white,
              boxShadow: publicShadows.card,
              cursor: 'pointer',
              transition: 'border-color 150ms, box-shadow 150ms, transform 150ms',
              '&:hover': {
                borderColor: 'rgba(115, 192, 100, 0.45)',
                boxShadow: '0 4px 14px rgba(15, 38, 92, 0.08)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: BORDER_RADIUS.lg,
                display: 'grid',
                placeItems: 'center',
                bgcolor: colors.greenMuted,
                color: colors.greenDark,
                border: '1px solid rgba(115, 192, 100, 0.24)',
              }}
            >
              <Icon size={18} strokeWidth={1.75} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.navy, lineHeight: 1.3 }}>
                {category.name}
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: 12, color: colors.textSecondary, lineHeight: 1.55 }}>
                {category.description}
              </Typography>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
