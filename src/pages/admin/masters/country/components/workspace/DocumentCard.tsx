import { useState, type ReactNode } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import {
  ArrowDown,
  ArrowUp,
  Copy,
  PencilLine,
  Trash2,
  Upload,
} from 'lucide-react'
import { BaseCard, RichTextContent, RowActions, Toggle } from '@/design-system/UIComponents'
import type { RowAction } from '@/design-system/UIComponents'
import { documentMasterService } from '@/shared/services/documentMasterService'
import type { CountryJurisdictionDocumentRule } from '@/shared/types/countryMaster'
import { EditDocumentDescriptionModal } from './drawers/EditDocumentDescriptionModal'
import { useCountryWorkspaceMode } from './countryWorkspaceModeContext'

const DOCUMENT_CARD_SX = {
  p: 2,
  height: '100%',
  borderWidth: 1,
  borderColor: 'divider',
  transition: 'border-color 0.15s, background-color 0.15s',
  '&:hover': {
    borderColor: 'primary.main',
    bgcolor: 'action.hover',
  },
} as const

interface DocumentCardProps {
  rule: CountryJurisdictionDocumentRule
  onChange: (next: CountryJurisdictionDocumentRule) => void
  onDuplicate?: () => void
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

function MetaRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Box sx={{ color: 'text.secondary', mt: 0.25, flexShrink: 0 }}>{icon}</Box>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        {text}
      </Typography>
    </Stack>
  )
}

export function DocumentCard({
  rule,
  onChange,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: DocumentCardProps) {
  const { readOnly } = useCountryWorkspaceMode()
  const [editDescriptionOpen, setEditDescriptionOpen] = useState(false)
  const master = documentMasterService.getById(rule.documentId)
  const name = master?.documentType ?? rule.documentId
  const description = rule.description || master?.description
  const editInitialDescription = rule.description ?? master?.description ?? ''

  const patch = (partial: Partial<CountryJurisdictionDocumentRule>) =>
    onChange({ ...rule, ...partial })

  const actions: RowAction[] = readOnly ? [] : [
    {
      label: 'Edit description',
      icon: <PencilLine size={14} />,
      onClick: () => setEditDescriptionOpen(true),
    },
    {
      label: rule.multipleUpload ? 'Disable multiple upload' : 'Enable multiple upload',
      icon: <Upload size={14} />,
      onClick: () => patch({ multipleUpload: !rule.multipleUpload }),
    },
    ...(onDuplicate
      ? [{ label: 'Duplicate', icon: <Copy size={14} />, onClick: () => onDuplicate() }]
      : []),
    ...(onMoveUp
      ? [
          {
            label: 'Move up',
            icon: <ArrowUp size={14} />,
            onClick: () => onMoveUp(),
            disabled: !canMoveUp,
          },
        ]
      : []),
    ...(onMoveDown
      ? [
          {
            label: 'Move down',
            icon: <ArrowDown size={14} />,
            onClick: () => onMoveDown(),
            disabled: !canMoveDown,
          },
        ]
      : []),
    ...(onDelete
      ? [
          {
            label: 'Delete',
            icon: <Trash2 size={14} />,
            onClick: () => onDelete(),
            variant: 'destructive' as const,
            divider: true,
          },
        ]
      : []),
  ]

  return (
    <BaseCard sx={DOCUMENT_CARD_SX}>
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ minWidth: 0, flex: 1 }}>
            {name}
          </Typography>
          {actions.length > 0 ? (
            <Box onClick={(e) => e.stopPropagation()} sx={{ flexShrink: 0 }}>
              <RowActions actions={actions} row={rule} />
            </Box>
          ) : null}
        </Stack>

        <Stack spacing={0.75}>
          {description ? <RichTextContent content={description} /> : null}
          {rule.multipleUpload ? (
            <MetaRow icon={<Upload size={14} />} text="Multiple upload allowed" />
          ) : null}
        </Stack>

        <Divider />

        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          useFlexGap
          onClick={(e) => e.stopPropagation()}
        >
          <Toggle
            checked={rule.mandatory}
            onChange={(v) => patch({ mandatory: v })}
            label="Mandatory"
            disabled={readOnly}
          />
          <Toggle
            checked={rule.commonDocument}
            onChange={(v) => patch({ commonDocument: v })}
            label="Common Document"
            disabled={readOnly}
          />
        </Stack>
      </Stack>

      <EditDocumentDescriptionModal
        open={editDescriptionOpen}
        initialDescription={editInitialDescription}
        onClose={() => setEditDescriptionOpen(false)}
        onSave={(nextDescription) => patch({ description: nextDescription })}
      />
    </BaseCard>
  )
}
