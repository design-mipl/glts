import { useState, type ReactNode } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import {
  ArrowDown,
  ArrowUp,
  Copy,
  FileText,
  PencilLine,
  Tag,
  Trash2,
  Upload,
} from 'lucide-react'
import { Badge, BaseCard, RichTextContent, RowActions, Toggle } from '@/design-system/UIComponents'
import type { RowAction } from '@/design-system/UIComponents'
import { getDocumentOwnerTypeLabel } from '@/pages/admin/masters/country/config/documentOwnerTypeConfig'
import { documentMasterService } from '@/shared/services/documentMasterService'
import type { BusinessSegment, CountryJurisdictionDocumentRule } from '@/shared/types/countryMaster'
import { AddDocumentModal, documentFormResultToRulePatch } from './drawers/AddDocumentModal'
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
  segment: BusinessSegment
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

function SampleDocumentBadge({ fileName, url }: { fileName: string; url?: string }) {
  const badge = (
    <Badge
      label="Sample"
      color="info"
      variant="soft"
      size="md"
      icon={<FileText size={12} strokeWidth={2.25} />}
      sx={url ? { cursor: 'pointer' } : undefined}
    />
  )

  if (!url) return badge

  return (
    <Box
      component="a"
      href={url}
      download={fileName}
      target="_blank"
      rel="noopener noreferrer"
      title={fileName}
      sx={{
        display: 'inline-flex',
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: '9999px',
        '&:hover': { opacity: 0.88 },
      }}
    >
      {badge}
    </Box>
  )
}

export function DocumentCard({
  segment,
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
  const [editOpen, setEditOpen] = useState(false)
  const master = documentMasterService.getById(rule.documentId)
  const name = master?.documentType ?? rule.documentId
  const ownerTypeLabel = getDocumentOwnerTypeLabel(rule.ownerType)
  const description = rule.description || master?.description

  const patch = (partial: Partial<CountryJurisdictionDocumentRule>) =>
    onChange({ ...rule, ...partial })

  const actions: RowAction[] = readOnly ? [] : [
    {
      label: 'Edit document',
      icon: <PencilLine size={14} />,
      onClick: () => setEditOpen(true),
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
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ minWidth: 0, flex: 1 }}
          >
            <Typography variant="subtitle2" fontWeight={700}>
              {name}
            </Typography>
            {ownerTypeLabel ? (
              <Badge
                label={ownerTypeLabel}
                color="info"
                variant="soft"
                size="md"
                icon={<Tag size={12} strokeWidth={2.25} />}
              />
            ) : null}
            {rule.hasSample && rule.sampleDocumentName ? (
              <SampleDocumentBadge
                fileName={rule.sampleDocumentName}
                url={rule.sampleDocumentUrl}
              />
            ) : null}
          </Stack>
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

      <AddDocumentModal
        open={editOpen}
        segment={segment}
        group={rule.group}
        editRule={rule}
        onClose={() => setEditOpen(false)}
        onSubmit={(result) => {
          patch(documentFormResultToRulePatch(result))
          setEditOpen(false)
        }}
      />
    </BaseCard>
  )
}
