import { Box, Grid, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { LayoutTemplate } from 'lucide-react'
import { BaseCard, Badge } from '@/design-system/UIComponents'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import {
  TEMPLATE_CATEGORY_LABELS,
  TEMPLATE_RECIPES,
  type TemplateRecipeCategory,
} from '../config/templateRegistry'

const categoryOrder: TemplateRecipeCategory[] = [
  'listing',
  'detail',
  'dashboard',
  'form',
]

export function TemplateShowcaseHub() {
  return (
    <Box>
      <AdminPageHeader
        eyebrow="Tools"
        title="Template showcase"
        description="Live module recipes wired to production shells and design-system components. Use this as the visual source of truth when building admin and portal modules."
      />

      {categoryOrder.map((category) => {
        const recipes = TEMPLATE_RECIPES.filter((recipe) => recipe.category === category)
        if (recipes.length === 0) return null

        return (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography variant="subtitle1" component="h2" fontWeight={700} sx={{ mb: 1.5 }}>
              {TEMPLATE_CATEGORY_LABELS[category]}
            </Typography>
            <Grid container spacing={2}>
              {recipes.map((recipe) => (
                <Grid key={recipe.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <BaseCard hoverable sx={{ height: '100%' }}>
                    <Box
                      component={RouterLink}
                      to={recipe.path}
                      sx={{
                        display: 'block',
                        height: '100%',
                        textDecoration: 'none',
                        color: 'inherit',
                        p: 2,
                      }}
                    >
                      <Stack spacing={1.25}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LayoutTemplate size={18} strokeWidth={1.75} />
                          <Typography variant="subtitle2" fontWeight={700}>
                            {recipe.title}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {recipe.description}
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={0.5} useFlexGap>
                          {recipe.components.slice(0, 3).map((component) => (
                            <Badge key={component} label={component} color="neutral" size="sm" />
                          ))}
                          {recipe.components.length > 3 ? (
                            <Badge label={`+${recipe.components.length - 3}`} color="neutral" size="sm" />
                          ) : null}
                        </Stack>
                      </Stack>
                    </Box>
                  </BaseCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )
      })}
    </Box>
  )
}
