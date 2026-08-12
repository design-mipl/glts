import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import type { OriginalDocumentCollectionState } from '@/shared/types/originalDocumentCollection'
import {
  COLLECTION_DETAIL_FIELDS_BY_METHOD,
  listReceivingOfficeOptions,
  originalCollectionMethodLabel,
  type CollectionDetailFieldDef,
} from '@/shared/utils/originalDocumentCollectionUtils'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25} minWidth={0}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 11 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        color="text.primary"
        sx={{
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1.35,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      >
        {value.trim() ? value : '—'}
      </Typography>
    </Stack>
  )
}

function MetaGrid({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        columnGap: 2,
        rowGap: 1.5,
      }}
    >
      {children}
    </Box>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, color: 'text.primary' }}>
      {children}
    </Typography>
  )
}

function formatDetailValue(field: CollectionDetailFieldDef, raw: string): string {
  const value = raw.trim()
  if (!value) return '—'

  if (field.optionsKey === 'receivingOffice') {
    const match = listReceivingOfficeOptions().find(option => option.value === value)
    return match?.label ?? value
  }

  if (field.type === 'date') {
    return formatDisplayDate(value)
  }

  return value
}

interface OriginalDocumentSendPlanSummaryProps {
  state: OriginalDocumentCollectionState
}

/** Admin read view of the client's physical-document send plan (not a disabled form). */
export function OriginalDocumentSendPlanSummary({ state }: OriginalDocumentSendPlanSummaryProps) {
  const methodLabel = originalCollectionMethodLabel(state.method)
  const selectedDocuments = state.receivedDocuments.filter(item => item.received)
  const detailFields = COLLECTION_DETAIL_FIELDS_BY_METHOD[state.method]
  const methodDetails = (state.details[state.method] ?? {}) as Record<string, string>

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <SectionTitle>Documents to send</SectionTitle>
        {selectedDocuments.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            {state.receivedDocuments.length === 0
              ? 'No physical documents required'
              : 'No documents selected yet'}
          </Typography>
        ) : (
          <Stack spacing={0.5} component="ul" sx={{ m: 0, pl: 2 }}>
            {selectedDocuments.map(item => (
              <Typography
                key={item.documentId}
                component="li"
                sx={{ fontSize: 13, fontWeight: 500, color: 'text.primary', lineHeight: 1.4 }}
              >
                {item.name}
              </Typography>
            ))}
          </Stack>
        )}
        {state.receivedDocuments.length > 0 ? (
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary' }}>
            Selected: {selectedDocuments.length} / {state.receivedDocuments.length}
          </Typography>
        ) : null}
      </Stack>

      <Stack spacing={0.75}>
        <SectionTitle>Send method</SectionTitle>
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.primary', lineHeight: 1.35 }}>
          {methodLabel}
        </Typography>
      </Stack>

      <Stack spacing={1}>
        <SectionTitle>Sending details</SectionTitle>
        <MetaGrid>
          {detailFields.map(field => (
            <Box
              key={field.key}
              sx={field.type === 'textarea' ? { gridColumn: '1 / -1' } : undefined}
            >
              <MetaItem
                label={field.label}
                value={formatDetailValue(field, methodDetails[field.key] ?? '')}
              />
            </Box>
          ))}
        </MetaGrid>
      </Stack>
    </Stack>
  )
}
