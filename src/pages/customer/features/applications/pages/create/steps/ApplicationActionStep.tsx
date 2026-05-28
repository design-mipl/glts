import { Box, Typography, Grid, Card, Stack, Button } from '@mui/material'
import { ArrowRight, FileText, Users } from 'lucide-react'
import { usePublicBrandColors, getPrimaryButtonSx } from '@/shared/theme/publicBrand'
import type { ApplicationFlowMode } from '../../../data/applicationFlowData'

interface ApplicationActionStepProps {
  mode: ApplicationFlowMode
  onSelect: (mode: ApplicationFlowMode) => void
  onContinue: () => void
}

const actions: Array<{
  id: ApplicationFlowMode
  title: string
  description: string
  icon: typeof FileText
}> = [
  {
    id: 'single',
    title: 'Create single application',
    description: 'One traveler — passport scan, auto-fill, and submit.',
    icon: FileText,
  },
  {
    id: 'bulk',
    title: 'Create bulk application',
    description: 'Upload a folder or ZIP — process many travelers at once.',
    icon: Users,
  },
]

export function ApplicationActionStep({ mode, onSelect, onContinue }: ApplicationActionStepProps) {
  const colors = usePublicBrandColors()
  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Typography sx={{ fontWeight: 800, fontSize: '20px', color: colors.navy, mb: 3 }}>
        Choose action
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {actions.map(({ id, title, description, icon: Icon }) => {
          const selected = mode === id
          return (
            <Grid size={{ xs: 12, sm: 6 }} key={id}>
              <Card
                onClick={() => onSelect(id)}
                sx={{
                  p: 2.5,
                  cursor: 'pointer',
                  height: '100%',
                  borderRadius: '14px',
                  border: `2px solid ${selected ? colors.greenBright : colors.border}`,
                  bgcolor: selected ? colors.greenMuted : '#fff',
                  '&:hover': { borderColor: colors.greenBright },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '10px',
                    bgcolor: selected ? colors.greenBright : colors.surfaceAlt,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  <Icon size={22} color={selected ? '#fff' : colors.navy} />
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: '15px', color: colors.navy, mb: 0.5 }}>
                  {title}
                </Typography>
                <Typography sx={{ fontSize: '13px', color: colors.textSecondary }}>{description}</Typography>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          endIcon={<ArrowRight size={16} />}
          onClick={onContinue}
          sx={{ ...getPrimaryButtonSx(colors), fontSize: '13px' }}
        >
          Continue
        </Button>
      </Stack>
    </Box>
  )
}
