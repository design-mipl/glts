import { Box, Typography, Card, Stack } from '@mui/material'
import { Upload, FileImage } from 'lucide-react'
import { FileUpload } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { ApplicationFlowState } from '../../../../hooks/useApplicationFlowState'
import { FlowStepActions } from '../../../../components/create/FlowStepActions'

interface PassportUploadStepProps {
  state: ApplicationFlowState
  onUpdate: (patch: Partial<ApplicationFlowState>) => void
  onContinue: () => void
}

export function PassportUploadStep({ state, onUpdate, onContinue }: PassportUploadStepProps) {
  const colors = usePublicBrandColors()

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', width: '100%' }}>
      <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 22 }, color: colors.navy, mb: 0.5 }}>
        Upload passport
      </Typography>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 2.5 }}>
        Start applicant onboarding with the bio page. GLTS will extract details automatically using OCR.
      </Typography>

      <Card
        sx={{
          p: 2.5,
          borderRadius: '14px',
          border: `1px solid ${colors.border}`,
          bgcolor: colors.white,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Upload size={18} color={colors.greenBright} />
          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Passport upload workspace</Typography>
        </Stack>
        <Typography sx={{ fontSize: 12, color: colors.textMuted, mb: 2 }}>
          Drag & drop · JPG, PNG, HEIC, PDF · Scan upload supported · Max 10 MB
        </Typography>
        <FileUpload
          onUpload={() => onUpdate({ passportUploaded: true })}
          accept="image/*,.pdf,.heic"
        />
        {state.passportUploaded && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mt: 2, p: 1.25, borderRadius: '10px', bgcolor: colors.greenMuted, border: `1px solid ${colors.green}` }}
          >
            <FileImage size={16} color={colors.greenDark} />
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.greenDark }}>
              Passport uploaded · Ready for OCR extraction
            </Typography>
          </Stack>
        )}
      </Card>

      <FlowStepActions
        onContinue={onContinue}
        continueLabel="Extract passport details"
        continueDisabled={!state.passportUploaded}
      />
    </Box>
  )
}
