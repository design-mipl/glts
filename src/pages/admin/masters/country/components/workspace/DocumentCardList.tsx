import { Box, Typography } from '@mui/material'
import type { BusinessSegment, CountryJurisdictionDocumentRule } from '@/shared/types/countryMaster'
import { DocumentCard } from './DocumentCard'

interface DocumentCardListProps {
  segment: BusinessSegment
  rules: CountryJurisdictionDocumentRule[]
  onChange: (rule: CountryJurisdictionDocumentRule) => void
  onDuplicate?: (rule: CountryJurisdictionDocumentRule) => void
  onDelete?: (rule: CountryJurisdictionDocumentRule) => void
  onMoveUp?: (index: number) => void
  onMoveDown?: (index: number) => void
}

export function DocumentCardList({
  segment,
  rules,
  onChange,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: DocumentCardListProps) {
  if (rules.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No documents configured. Add from Document Master.
      </Typography>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        gap: 1.5,
      }}
    >
      {rules.map((rule, index) => (
        <DocumentCard
          key={rule.id}
          segment={segment}
          rule={rule}
          onChange={onChange}
          onDuplicate={onDuplicate ? () => onDuplicate(rule) : undefined}
          onDelete={onDelete ? () => onDelete(rule) : undefined}
          onMoveUp={onMoveUp ? () => onMoveUp(index) : undefined}
          onMoveDown={onMoveDown ? () => onMoveDown(index) : undefined}
          canMoveUp={index > 0}
          canMoveDown={index < rules.length - 1}
        />
      ))}
    </Box>
  )
}
