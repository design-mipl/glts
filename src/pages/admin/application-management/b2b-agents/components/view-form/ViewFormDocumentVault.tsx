import { useMemo, useState } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { ChevronDown, Download, Eye, FolderArchive } from 'lucide-react'
import { Badge, Button, IconButton, useToast } from '@/design-system/UIComponents'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { FormAssistSubmissionDraft } from '@/shared/services/applicationFormAssistService'
import {
  buildApplicationDocumentVaultItems,
  downloadAllVaultDocuments,
  downloadVaultDocument,
  type DocumentVaultItem,
} from '../../utils/applicationDocumentVaultUtils'

interface ViewFormDocumentVaultProps {
  applicationId: string
  selectedRow: UploadQueueRow
  detail: ApplicationDetailViewModel
  submission?: FormAssistSubmissionDraft
  /** When true, document list is expanded on mount (e.g. finance expense detail). */
  defaultExpanded?: boolean
}

function VaultRow({
  item,
  onPreview,
  onDownload,
}: {
  item: DocumentVaultItem
  onPreview: (item: DocumentVaultItem) => void
  onDownload: (item: DocumentVaultItem) => void
}) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      spacing={1}
      sx={{
        px: 1.5,
        py: 1.25,
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={0.35} sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
            {item.label}
          </Typography>
          <Badge
            label={item.categoryLabel}
            color={item.category === 'global' ? 'info' : item.category === 'submission' ? 'neutral' : 'success'}
            size="sm"
          />
          <Badge
            label={item.statusLabel}
            color={item.available ? 'success' : 'warning'}
            size="sm"
          />
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, wordBreak: 'break-all' }}>
          {item.fileName}
          {item.uploadedAt
            ? ` · Uploaded ${new Date(item.uploadedAt).toLocaleDateString()}`
            : item.travelerName
              ? ` · ${item.travelerName}`
              : ''}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={0.75} sx={{ flexShrink: 0 }}>
        <IconButton
          variant="outlined"
          size="sm"
          tooltip="Preview"
          icon={<Eye size={14} />}
          disabled={!item.available}
          onClick={() => onPreview(item)}
        />
        <IconButton
          variant="outlined"
          size="sm"
          tooltip="Download"
          icon={<Download size={14} />}
          disabled={!item.available}
          onClick={() => onDownload(item)}
        />
      </Stack>
    </Stack>
  )
}

export function ViewFormDocumentVault({
  applicationId,
  selectedRow,
  detail,
  submission,
  defaultExpanded = false,
}: ViewFormDocumentVaultProps) {
  const { showToast } = useToast()
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [downloadingAll, setDownloadingAll] = useState(false)

  const items = useMemo(
    () =>
      buildApplicationDocumentVaultItems({
        applicationId,
        selectedRow,
        detail,
        submission,
      }),
    [applicationId, selectedRow, detail, submission],
  )

  const availableCount = items.filter(item => item.available).length

  const handlePreview = (item: DocumentVaultItem) => {
    showToast({
      title: 'Preview',
      description: `${item.fileName} will open here in production.`,
      variant: 'info',
    })
  }

  const handleDownload = (item: DocumentVaultItem) => {
    downloadVaultDocument(item)
    showToast({
      title: 'Download started',
      description: item.fileName,
      variant: 'success',
    })
  }

  const handleDownloadAll = async () => {
    if (availableCount === 0) {
      showToast({
        title: 'No documents available',
        description: 'Upload or verify documents before downloading.',
        variant: 'warning',
      })
      return
    }

    setDownloadingAll(true)
    try {
      const count = await downloadAllVaultDocuments(
        items,
        `${selectedRow.travelerName}-${applicationId}`,
      )
      showToast({
        title: 'Download all started',
        description: `${count} file${count === 1 ? '' : 's'} plus manifest downloaded.`,
        variant: 'success',
      })
    } finally {
      setDownloadingAll(false)
    }
  }

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1.5}
        role="button"
        aria-expanded={expanded}
        sx={{
          px: 2,
          py: 1.25,
          cursor: 'pointer',
          bgcolor: 'background.paper',
        }}
        onClick={() => setExpanded(prev => !prev)}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
          <ChevronDown
            size={18}
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
              flexShrink: 0,
            }}
          />
          <Stack spacing={0.25} sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                Document vault
              </Typography>
              <Badge label={`${availableCount} available`} color="info" size="sm" />
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {selectedRow.travelerName} · {items.length} file{items.length === 1 ? '' : 's'}
            </Typography>
          </Stack>
        </Stack>

        <Button
          label={downloadingAll ? 'Downloading…' : 'Download all'}
          variant="contained"
          size="sm"
          startIcon={<FolderArchive size={14} />}
          disabled={downloadingAll || availableCount === 0}
          onClick={event => {
            event.stopPropagation()
            void handleDownloadAll()
          }}
          sx={{ width: { xs: '100%', sm: 'auto' }, flexShrink: 0 }}
        />
      </Stack>

      <Collapse in={expanded}>
        <Box
          sx={{
            px: 2,
            py: 2,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 1.5 }}>
            All traveler, global, and submission files for {selectedRow.travelerName}. Download individually or use
            Download all above.
          </Typography>

          {items.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              No documents are available for this traveler yet.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {items.map(item => (
                <VaultRow
                  key={item.id}
                  item={item}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Collapse>
    </Box>
  )
}
