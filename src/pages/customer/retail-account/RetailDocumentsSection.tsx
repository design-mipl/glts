import { useCallback, useMemo, useState } from 'react'
import { Box, Menu, MenuItem, Stack, Typography } from '@mui/material'
import {
  FileText,
  IdCard,
  Image as ImageIcon,
  MoreVertical,
  Plus,
  Search,
} from 'lucide-react'
import { ConfirmDialog, useToast } from '@/design-system/UIComponents'
import { AccentButton, QuietButton } from './retailAccountButtons'
import { RetailDocumentModal } from './RetailDocumentModal'
import { useRetailAccountIdentity } from './useRetailAccountIdentity'
import {
  applyFlow,
  applyFlowButtonPadding,
  applyFont,
  applyMotion,
  applyRadius,
  eyebrowSx,
  focusRingSx,
  getPressSx,
  tabularNums,
} from '@/pages/website/theme/applyFlowTheme'
import {
  listStoredDocuments,
  removeStoredDocument,
  storedDocumentCategory,
  storedDocumentTypeLabel,
  upsertStoredDocument,
  STORED_DOCUMENT_CATEGORY_LABELS,
  STORED_DOCUMENT_CATEGORY_ORDER,
  type StoredDocument,
  type StoredDocumentCategory,
  type StoredDocumentType,
} from '@/shared/services/storedDocumentsService'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'

/** Photo documents get an image glyph so they are distinguishable at a glance in a dense grid. */
function docIcon(type: StoredDocumentType) {
  if (type === 'photo') return ImageIcon
  if (type === 'aadhaar' || type === 'pan') return IdCard
  return FileText
}

type FilterKey = 'all' | StoredDocumentCategory

export function RetailDocumentsSection() {
  const { showToast } = useToast()
  const { displayName } = useRetailAccountIdentity()
  const [docs, setDocs] = useState(() => listStoredDocuments())
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterKey>('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<StoredDocument | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<StoredDocument | null>(null)

  const refresh = useCallback(() => setDocs(listStoredDocuments()), [])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openReplace = (doc: StoredDocument) => {
    setEditing(doc)
    setModalOpen(true)
  }

  const handleSave = (payload: {
    id?: string
    type: StoredDocumentType
    label: string
    fileName: string
    fileUrl?: string
  }) => {
    if (!payload.fileName.trim()) {
      showToast({ title: 'Choose a file to upload', variant: 'error' })
      return
    }
    upsertStoredDocument(payload)
    refresh()
    setModalOpen(false)
    showToast({ title: payload.id ? 'Document replaced' : 'Document saved', variant: 'success' })
  }

  const counts = useMemo(() => {
    const next: Record<FilterKey, number> = { all: docs.length, travel: 0, identity: 0, supporting: 0 }
    docs.forEach(d => {
      next[storedDocumentCategory(d.type)] += 1
    })
    return next
  }, [docs])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return docs.filter(d => {
      if (filter !== 'all' && storedDocumentCategory(d.type) !== filter) return false
      if (!q) return true
      return (
        d.label.toLowerCase().includes(q) ||
        d.fileName.toLowerCase().includes(q) ||
        storedDocumentTypeLabel(d.type).toLowerCase().includes(q)
      )
    })
  }, [docs, query, filter])

  /** Grouped so the grid stays scannable once a customer stores 15–20 documents. */
  const groups = useMemo(
    () =>
      STORED_DOCUMENT_CATEGORY_ORDER.map(category => ({
        category,
        items: visible.filter(d => storedDocumentCategory(d.type) === category),
      })).filter(g => g.items.length > 0),
    [visible],
  )

  return (
    <Box
      sx={{
        p: { xs: 2.5, lg: 3 },
        borderRadius: applyRadius.card,
        bgcolor: applyFlow.surface,
        border: `1px solid ${applyFlow.hairline}`,
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', lg: 'flex-start' }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography sx={{ ...eyebrowSx, mb: 0.75 }}>Reusable files</Typography>
          <Typography
            sx={{
              fontFamily: applyFont.display,
              fontWeight: 700,
              fontSize: 20,
              color: applyFlow.ink,
              letterSpacing: '-0.01em',
            }}
          >
            My Documents
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13.5, color: applyFlow.inkMuted, maxWidth: 520 }}>
            Save a document once and attach it to any future application instead of uploading it
            again.
          </Typography>
        </Box>
        <AccentButton startIcon={<Plus size={15} />} onClick={openCreate}>
          Add document
        </AccentButton>
      </Stack>

      {docs.length > 0 ? (
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={1.25}
          alignItems={{ xs: 'stretch', lg: 'center' }}
          sx={{ mb: 2.5 }}
        >
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0, maxWidth: { lg: 320 } }}>
            <Search
              size={15}
              color={applyFlow.inkFaint}
              style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}
            />
            <Box
              component="input"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search documents"
              aria-label="Search documents"
              sx={{
                width: '100%',
                height: 36,
                pl: '32px',
                pr: 1.5,
                fontFamily: applyFont.body,
                fontSize: 13.5,
                color: applyFlow.ink,
                bgcolor: applyFlow.surface,
                border: `1px solid ${applyFlow.hairline}`,
                borderRadius: applyRadius.control,
                outline: 'none',
                transition: 'border-color 150ms ease',
                '&::placeholder': { color: applyFlow.inkFaint },
                '&:hover': { borderColor: applyFlow.hairlineStrong },
                ...focusRingSx,
              }}
            />
          </Box>

          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            <FilterChip
              label="All"
              count={counts.all}
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            />
            {STORED_DOCUMENT_CATEGORY_ORDER.filter(c => counts[c] > 0).map(category => (
              <FilterChip
                key={category}
                label={STORED_DOCUMENT_CATEGORY_LABELS[category]}
                count={counts[category]}
                active={filter === category}
                onClick={() => setFilter(category)}
              />
            ))}
          </Stack>
        </Stack>
      ) : null}

      {docs.length === 0 ? (
        <EmptyPanel
          title="No saved documents yet"
          description="Upload your passport, Aadhaar, PAN or photo once. We'll offer them the next time an application asks for one."
          actionLabel="Upload a document"
          onAction={openCreate}
        />
      ) : visible.length === 0 ? (
        <EmptyPanel
          title="No documents match that search"
          description="Try a different name, or clear the filters to see everything you've saved."
          actionLabel="Clear filters"
          onAction={() => {
            setQuery('')
            setFilter('all')
          }}
        />
      ) : (
        <Stack spacing={3}>
          {groups.map(group => (
            <Box key={group.category}>
              {/* Section labels only earn their space once more than one group is on screen. */}
              {groups.length > 1 ? (
                <Typography sx={{ ...eyebrowSx, mb: 1.25 }}>
                  {STORED_DOCUMENT_CATEGORY_LABELS[group.category]} · {group.items.length}
                </Typography>
              ) : null}
              <Box
                sx={{
                  display: 'grid',
                  gap: 1.5,
                  // Project breakpoints are shifted: lg=600, desktop=1024.
                  gridTemplateColumns: {
                    xs: '1fr',
                    lg: 'repeat(2, minmax(0, 1fr))',
                    desktop: 'repeat(3, minmax(0, 1fr))',
                  },
                }}
              >
                {group.items.map(doc => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    onReplace={() => openReplace(doc)}
                    onRemove={() => setDeleteTarget(doc)}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Stack>
      )}

      <RetailDocumentModal
        open={modalOpen}
        editing={editing}
        ownerName={displayName}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) removeStoredDocument(deleteTarget.id)
          refresh()
          setDeleteTarget(null)
          showToast({ title: 'Document removed', variant: 'success' })
        }}
        title="Remove this document?"
        description={
          deleteTarget
            ? `${deleteTarget.label} will no longer be offered on new applications. You can upload it again anytime.`
            : undefined
        }
        confirmLabel="Remove"
        variant="destructive"
      />
    </Box>
  )
}

function DocumentCard({
  doc,
  onReplace,
  onRemove,
}: {
  doc: StoredDocument
  onReplace: () => void
  onRemove: () => void
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const Icon = docIcon(doc.type)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.25,
        p: 1.75,
        borderRadius: applyRadius.control,
        bgcolor: applyFlow.surface,
        border: `1px solid ${applyFlow.hairline}`,
        transition: `border-color 160ms ${applyMotion.easeOut}, box-shadow 160ms ${applyMotion.easeOut}`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': {
            borderColor: applyFlow.hairlineStrong,
            boxShadow: '0 6px 18px rgba(15, 23, 42, 0.05)',
          },
        },
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          width: 34,
          height: 34,
          borderRadius: applyRadius.chip,
          display: 'grid',
          placeItems: 'center',
          bgcolor: applyFlow.accentSoft,
        }}
      >
        <Icon size={16} color={applyFlow.accentInk} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{ fontSize: 13.5, fontWeight: 700, color: applyFlow.ink, lineHeight: 1.35 }}
          noWrap
        >
          {doc.label}
        </Typography>
        <Typography sx={{ fontSize: 12, color: applyFlow.inkMuted, mt: 0.25 }} noWrap>
          {doc.fileName}
        </Typography>
        <Typography
          sx={{
            fontFamily: applyFont.mono,
            fontSize: 11,
            color: applyFlow.inkFaint,
            mt: 0.75,
            ...tabularNums,
          }}
        >
          Saved {formatDisplayDate(doc.uploadedAt)}
        </Typography>
      </Box>

      <Box
        component="button"
        type="button"
        aria-label={`Actions for ${doc.label}`}
        onClick={e => setAnchor(e.currentTarget)}
        sx={{
          flexShrink: 0,
          width: 28,
          height: 28,
          display: 'grid',
          placeItems: 'center',
          borderRadius: applyRadius.chip,
          border: '1px solid transparent',
          bgcolor: 'transparent',
          color: applyFlow.inkFaint,
          cursor: 'pointer',
          p: 0,
          '&:hover': { bgcolor: applyFlow.canvas, color: applyFlow.ink },
          ...focusRingSx,
          ...getPressSx(),
        }}
      >
        <MoreVertical size={15} />
      </Box>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: applyRadius.control,
              border: `1px solid ${applyFlow.hairline}`,
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
              minWidth: 168,
            },
          },
        }}
      >
        {doc.fileUrl ? (
          <MenuItem
            sx={menuItemSx}
            onClick={() => {
              window.open(doc.fileUrl, '_blank', 'noopener,noreferrer')
              setAnchor(null)
            }}
          >
            View
          </MenuItem>
        ) : null}
        <MenuItem
          sx={menuItemSx}
          onClick={() => {
            onReplace()
            setAnchor(null)
          }}
        >
          Replace
        </MenuItem>
        <MenuItem
          sx={{ ...menuItemSx, color: applyFlow.critical }}
          onClick={() => {
            onRemove()
            setAnchor(null)
          }}
        >
          Remove
        </MenuItem>
      </Menu>
    </Box>
  )
}

const menuItemSx = {
  fontFamily: applyFont.body,
  fontSize: 13.5,
  fontWeight: 600,
  color: applyFlow.ink,
} as const

function EmptyPanel({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}) {
  return (
    <Box
      sx={{
        py: 5,
        px: 3,
        textAlign: 'center',
        borderRadius: applyRadius.control,
        border: `1px dashed ${applyFlow.hairlineStrong}`,
        bgcolor: applyFlow.canvas,
      }}
    >
      <FileText size={26} color={applyFlow.inkFaint} />
      <Typography sx={{ mt: 1.25, fontWeight: 700, fontSize: 15, color: applyFlow.ink }}>
        {title}
      </Typography>
      <Typography
        sx={{ mt: 0.75, fontSize: 13, color: applyFlow.inkMuted, maxWidth: 400, mx: 'auto', lineHeight: 1.55 }}
      >
        {description}
      </Typography>
      <QuietButton sx={{ mt: 2.25 }} onClick={onAction}>
        {actionLabel}
      </QuietButton>
    </Box>
  )
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-pressed={active}
      sx={{
        appearance: 'none',
        cursor: 'pointer',
        ...applyFlowButtonPadding.md,
        minHeight: 36,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        borderRadius: applyRadius.control,
        fontFamily: applyFont.body,
        fontSize: 13.5,
        fontWeight: active ? 700 : 600,
        color: active ? applyFlow.ink : applyFlow.inkFaint,
        bgcolor: active ? applyFlow.accentSoft : applyFlow.canvas,
        border: `1px solid ${active ? applyFlow.accentBorder : applyFlow.hairline}`,
        '&:hover': {
          bgcolor: applyFlow.accentSoft,
          borderColor: applyFlow.accentBorder,
          color: applyFlow.ink,
        },
        ...focusRingSx,
        ...getPressSx(
          0.97,
          `background-color 160ms ${applyMotion.easeOut}, border-color 160ms ${applyMotion.easeOut}, color 160ms ${applyMotion.easeOut}`,
        ),
      }}
    >
      {label}
      <Box
        component="span"
        sx={{
          fontFamily: applyFont.mono,
          fontSize: 11,
          color: active ? applyFlow.accentInk : applyFlow.inkFaint,
          ...tabularNums,
        }}
      >
        {count}
      </Box>
    </Box>
  )
}
