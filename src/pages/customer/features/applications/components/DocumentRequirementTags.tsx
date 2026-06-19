import { Chip, Stack } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { PHYSICAL_DOCUMENT_LABEL } from '@/shared/constants/documentRequirementLabels'

export interface DocumentRequirementTagsProps {
  mandatory: boolean
  originalDocument?: boolean
}

export function DocumentRequirementTags({ mandatory, originalDocument }: DocumentRequirementTagsProps) {
  const colors = usePublicBrandColors()

  return (
    <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap" useFlexGap>
      <Chip
        label={mandatory ? 'Mandatory' : 'Optional'}
        size="small"
        sx={{
          height: 20,
          fontSize: 10,
          fontWeight: 700,
          bgcolor: mandatory ? colors.greenMuted : colors.surfaceAlt,
          color: mandatory ? colors.greenDark : colors.textMuted,
        }}
      />
      {originalDocument ? (
        <Chip
          label={PHYSICAL_DOCUMENT_LABEL}
          size="small"
          sx={{
            height: 20,
            fontSize: 10,
            fontWeight: 700,
            bgcolor: colors.checklistMuted,
            color: colors.navy,
            border: `1px solid ${colors.checklistBorder}`,
          }}
        />
      ) : null}
    </Stack>
  )
}
