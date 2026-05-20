import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Check } from 'lucide-react'
import { useFoundationTheme } from '../../../design-system/ThemeContext'
import { TEMPLATE_OPTIONS, type TemplateOption } from '../../../design-system/themeConfig'

function TemplatePreview({ active }: { active: boolean }) {
  return (
    <Stack
      spacing={0.75}
      sx={{
        minWidth: 64,
        p: 1,
        borderRadius: 1.5,
        bgcolor: (theme) => alpha(theme.palette.primary.main, active ? 0.14 : 0.06),
      }}
    >
      <Box sx={{ height: 6, borderRadius: 999, bgcolor: active ? 'primary.main' : 'divider' }} />
      <Box sx={{ display: 'grid', gap: 0.5, gridTemplateColumns: '18px 1fr' }}>
        <Box sx={{ minHeight: 26, borderRadius: 1, bgcolor: active ? 'primary.main' : 'divider' }} />
        <Stack spacing={0.5}>
          <Box sx={{ height: 8, borderRadius: 999, bgcolor: 'background.paper' }} />
          <Box sx={{ height: 8, borderRadius: 999, bgcolor: 'background.paper' }} />
        </Stack>
      </Box>
    </Stack>
  )
}

function TemplateCard({
  label,
  description,
  value,
  active,
  onSelect,
}: {
  label: string
  description: string
  value: TemplateOption
  active: boolean
  onSelect: (value: TemplateOption) => void
}) {
  return (
    <Box
      onClick={() => onSelect(value)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 1.5,
        py: 1.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: active ? 'primary.main' : 'divider',
        bgcolor: active
          ? (theme) => alpha(theme.palette.primary.main, 0.06)
          : 'transparent',
        cursor: 'pointer',
        transition: 'border-color 150ms ease, background-color 150ms ease',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      <TemplatePreview active={active} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Box>

      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid',
          borderColor: active ? 'primary.main' : 'divider',
          bgcolor: active ? 'primary.main' : 'transparent',
          color: active ? 'primary.contrastText' : 'transparent',
          flexShrink: 0,
        }}
      >
        <Check size={12} />
      </Box>
    </Box>
  )
}

export default function TemplateSelector() {
  const { config, setSelectedTemplate } = useFoundationTheme()

  return (
    <Stack spacing={1.5}>
      <Box>
        <Typography variant="subtitle2" fontWeight={700}>
          Layout Template
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Choose your preferred layout style. Template routing and shell behavior will arrive in a later phase.
        </Typography>
      </Box>

      {TEMPLATE_OPTIONS.map((option) => (
        <TemplateCard
          key={option.value}
          label={option.label}
          description={option.description}
          value={option.value}
          active={config.selectedTemplate === option.value}
          onSelect={setSelectedTemplate}
        />
      ))}
    </Stack>
  )
}
