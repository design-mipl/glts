import { Stack, Typography } from '@mui/material'
import { CheckCircle2 } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  COLLECTION_DETAIL_FIELDS_BY_METHOD,
  originalCollectionMethodLabel,
} from '@/shared/utils/originalDocumentCollectionUtils'
import type { OriginalDocumentCollectionMethod } from '@/shared/types/originalDocumentCollection'
import { StepShell } from '../StepShell'

interface CollectionConfirmationStepProps {
  method: OriginalDocumentCollectionMethod
  values: Record<string, string>
  onBack: () => void
  onContinue: () => void
}

export function CollectionConfirmationStep({ method, values, onBack, onContinue }: CollectionConfirmationStepProps) {
  const colors = usePublicBrandColors()
  const fields = COLLECTION_DETAIL_FIELDS_BY_METHOD[method]

  return (
    <StepShell title="Collection arranged" onBack={onBack} onContinue={onContinue} continueLabel="Continue to extras">
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
        <CheckCircle2 size={22} color={colors.greenDark} />
        <Typography sx={{ fontSize: '15px', fontWeight: 700, color: colors.text }}>
          {originalCollectionMethodLabel(method)}
        </Typography>
      </Stack>
      <Stack spacing={0.75}>
        {fields
          .filter((field) => (values[field.key] ?? '').trim().length > 0)
          .map((field) => (
            <Stack key={field.key} direction="row" justifyContent="space-between" sx={{ py: 0.5, borderBottom: `1px solid ${colors.border}` }}>
              <Typography sx={{ fontSize: '13px', color: colors.textSecondary }}>{field.label}</Typography>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{values[field.key]}</Typography>
            </Stack>
          ))}
      </Stack>
    </StepShell>
  )
}
