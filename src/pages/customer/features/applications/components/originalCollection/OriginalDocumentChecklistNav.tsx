import { Box, Stack, Typography } from '@mui/material'
import { Checkbox } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { OriginalDocumentReceivedItem } from '@/shared/types/originalDocumentCollection'

interface OriginalDocumentChecklistNavProps {
  items: OriginalDocumentReceivedItem[]
  onToggle: (documentId: string, received: boolean) => void
  readOnly?: boolean
}

export function OriginalDocumentChecklistNav({
  items,
  onToggle,
  readOnly = false,
}: OriginalDocumentChecklistNavProps) {
  const colors = usePublicBrandColors()

  if (items.length === 0) {
    return (
      <Typography sx={{ fontSize: 11.5, color: colors.textMuted, px: 1.25, py: 1 }}>
        No physical documents required for this visa type.
      </Typography>
    )
  }

  return (
    <Box sx={{ px: 1.25, py: 1.25, bgcolor: colors.white }}>
      <Stack spacing={0.5}>
        {items.map(item => (
          <Box
            key={item.documentId}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              py: 0.25,
            }}
          >
            <Checkbox
              size="sm"
              checked={item.received}
              disabled={readOnly}
              onChange={checked => onToggle(item.documentId, checked)}
              sx={{ m: 0, p: 0.25 }}
            />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: item.received ? 600 : 500,
                color: item.received ? colors.navy : colors.textSecondary,
                lineHeight: 1.35,
              }}
            >
              {item.name}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
