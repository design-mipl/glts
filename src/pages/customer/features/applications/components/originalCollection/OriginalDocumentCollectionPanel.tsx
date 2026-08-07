import { useMemo } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import {
  BaseCard,
  Checkbox,
  RadioGroup,
} from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { PHYSICAL_DOCUMENT_COLLECTION_LABEL } from '@/shared/constants/documentRequirementLabels'
import type {
  OriginalDocumentCollectionMethod,
  OriginalDocumentCollectionState,
  OriginalRequiredDocumentRef,
} from '@/shared/types/originalDocumentCollection'
import {
  COLLECTION_DETAIL_FIELDS_BY_METHOD,
  countDocumentsReceived,
  listReceivingOfficeOptions,
  ORIGINAL_COLLECTION_METHOD_OPTIONS,
  patchCollectionDetailField,
  toggleOriginalDocumentReceived,
} from '@/shared/utils/originalDocumentCollectionUtils'
import { CollectionDetailFields } from './CollectionDetailFields'

interface OriginalDocumentCollectionPanelProps {
  documents: OriginalRequiredDocumentRef[]
  state: OriginalDocumentCollectionState
  onChange: (next: OriginalDocumentCollectionState) => void
  readOnly?: boolean
  /** Admin surfaces use BaseCard wrapper; customer drawer renders inside scroll area. */
  variant?: 'card' | 'plain' | 'embedded'
}

/** Customer-facing panel for planning how physical originals will be sent to GLTS. */
export function OriginalDocumentCollectionPanel({
  documents: _documents,
  state,
  onChange,
  readOnly = false,
  variant = 'plain',
}: OriginalDocumentCollectionPanelProps) {
  const colors = usePublicBrandColors()
  const receivingOfficeOptions = useMemo(() => listReceivingOfficeOptions(), [])
  const { received, total } = countDocumentsReceived(state)

  const handleToggleReceived = (documentId: string, receivedValue: boolean) => {
    onChange(toggleOriginalDocumentReceived(state, documentId, receivedValue))
  }

  const handleMethodChange = (method: string | number) => {
    onChange({ ...state, method: method as OriginalDocumentCollectionMethod })
  }

  const handleDetailChange = (key: string, value: string) => {
    onChange(patchCollectionDetailField(state, state.method, key, value))
  }

  const methodDetails = state.details[state.method] ?? {}
  const detailFields = COLLECTION_DETAIL_FIELDS_BY_METHOD[state.method]

  const content = (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.navy }}>
          Documents to send
        </Typography>
        <Typography sx={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.45 }}>
          Fetched from Country / Visa Type Document Checklist
        </Typography>
        <Stack spacing={0.5} sx={{ pt: 0.5, pl: 1.5 }}>
          {state.receivedDocuments.map(item => (
            <Checkbox
              key={item.documentId}
              size="sm"
              label={item.name}
              checked={item.received}
              disabled={readOnly}
              onChange={checked => handleToggleReceived(item.documentId, checked)}
            />
          ))}
          {state.receivedDocuments.length === 0 ? (
            <Typography sx={{ fontSize: 13, color: colors.textMuted }}>
              No physical documents are required for this checklist.
            </Typography>
          ) : null}
        </Stack>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, pt: 0.5, pl: 1.5 }}>
          Documents selected: {received} / {total}
        </Typography>
      </Stack>

      <Divider />

      <Stack spacing={1}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.navy }}>
          How will you send the documents?
        </Typography>
        <RadioGroup
          size="sm"
          orientation="vertical"
          value={state.method}
          onChange={readOnly ? undefined : handleMethodChange}
          options={ORIGINAL_COLLECTION_METHOD_OPTIONS.map(option => ({
            ...option,
            disabled: readOnly,
          }))}
          sx={{ pl: 1.5 }}
        />
      </Stack>

      <Divider />

      <Stack spacing={1} key={state.method}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.navy }}>
          Sending details
        </Typography>
        <CollectionDetailFields
          fields={detailFields}
          values={methodDetails as Record<string, string>}
          receivingOfficeOptions={receivingOfficeOptions}
          onChange={handleDetailChange}
          readOnly={readOnly}
        />
      </Stack>
    </Stack>
  )

  if (variant === 'embedded') {
    return content
  }

  if (variant === 'card') {
    return (
      <BaseCard
        sx={{
          p: 2,
          borderWidth: 1,
          borderColor: 'divider',
          borderRadius: '8px',
          bgcolor: 'background.paper',
        }}
      >
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" fontWeight={700}>
            {PHYSICAL_DOCUMENT_COLLECTION_LABEL}
          </Typography>
          {content}
        </Stack>
      </BaseCard>
    )
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
        bgcolor: colors.white,
      }}
    >
      <Stack spacing={1.5}>
        <Typography sx={{ fontWeight: 800, fontSize: 16, color: colors.navy }}>
          {PHYSICAL_DOCUMENT_COLLECTION_LABEL}
        </Typography>
        {content}
      </Stack>
    </Box>
  )
}
