import { Box, Typography, Stack, Button, TextField, MenuItem } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { usePublicBrandColors, getPrimaryButtonSx } from '@/shared/theme/publicBrand'
import type { ApplicationFlowMode } from '../../../data/applicationFlowData'
import type { ApplicationFlowState } from '../../../hooks/useApplicationFlowState'

interface TravelDateStepProps {
  mode: ApplicationFlowMode
  state: ApplicationFlowState
  onUpdate: (patch: Partial<ApplicationFlowState>) => void
  onContinue: () => void
}

export function TravelDateStep({ mode, state, onUpdate, onContinue }: TravelDateStepProps) {
  const colors = usePublicBrandColors()
  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', width: '100%' }}>
      <Typography sx={{ fontWeight: 800, fontSize: '20px', color: colors.navy, mb: 3 }}>
        Select travel date
      </Typography>

      <Typography sx={{ fontWeight: 700, fontSize: '13px', mb: 1 }}>Intended travel date</Typography>
      <TextField
        type="date"
        fullWidth
        size="small"
        value={state.travelDate}
        onChange={e => onUpdate({ travelDate: e.target.value })}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />

      {mode === 'bulk' && (
        <>
          <Typography sx={{ fontWeight: 700, fontSize: '13px', mb: 1, mt: 2 }}>Upload source</Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={state.uploadSource}
            onChange={e => onUpdate({ uploadSource: e.target.value as ApplicationFlowState['uploadSource'] })}
          >
            <MenuItem value="folder">Folder upload</MenuItem>
            <MenuItem value="zip">ZIP archive</MenuItem>
          </TextField>
        </>
      )}

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button
          variant="contained"
          endIcon={<ArrowRight size={16} />}
          onClick={onContinue}
          disabled={!state.travelDate}
          sx={{ ...getPrimaryButtonSx(colors), fontSize: '13px' }}
        >
          Continue to upload documents
        </Button>
      </Stack>
    </Box>
  )
}
