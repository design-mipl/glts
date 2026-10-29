import { Stack, Typography } from '@mui/material'
import { Badge } from '@/design-system/UIComponents'
import { documentMasterService } from '@/shared/services/documentMasterService'

interface RequirementDocumentChipsProps {
  documentIds: string[]
  emptyLabel: string
  onRemove: (documentId: string) => void
}

export function RequirementDocumentChips({
  documentIds,
  emptyLabel,
  onRemove,
}: RequirementDocumentChipsProps) {
  if (documentIds.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        {emptyLabel}
      </Typography>
    )
  }

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {documentIds.map((documentId) => {
        const master = documentMasterService.getById(documentId)
        const label = master?.documentType ?? documentId
        return (
          <Badge
            key={documentId}
            label={label}
            color="neutral"
            variant="soft"
            size="md"
            onDelete={() => onRemove(documentId)}
          />
        )
      })}
    </Stack>
  )
}
