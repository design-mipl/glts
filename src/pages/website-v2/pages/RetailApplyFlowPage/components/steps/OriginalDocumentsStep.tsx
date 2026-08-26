import { Box, Stack, Typography } from '@mui/material'
import { FileCheck2 } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { StepShell } from '../StepShell'
import type { RetailChecklistDocument } from '@/shared/services/retailJourneyResolver'

interface OriginalDocumentsStepProps {
  documents: RetailChecklistDocument[]
  onBack: () => void
  onContinue: () => void
}

export function OriginalDocumentsStep({ documents, onBack, onContinue }: OriginalDocumentsStepProps) {
  const colors = usePublicBrandColors()
  const originals = documents.filter((doc) => doc.originalDocument)

  return (
    <StepShell
      title="These need physical originals"
      helperText="The embassy requires original copies of the following — we'll arrange collection next."
      onBack={onBack}
      onContinue={onContinue}
    >
      <Stack spacing={1.25}>
        {originals.map((doc) => (
          <Stack key={doc.documentId} direction="row" alignItems="center" spacing={1.5} sx={{ border: `1px solid ${colors.border}`, borderRadius: BORDER_RADIUS.lg, p: 1.5 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: BORDER_RADIUS.md, backgroundColor: colors.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck2 size={15} color={colors.textMuted} />
            </Box>
            <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: colors.text }}>{doc.name}</Typography>
          </Stack>
        ))}
      </Stack>
    </StepShell>
  )
}
