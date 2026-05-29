import { Grid, Stack, Typography } from '@mui/material'
import { Pencil, Power, PowerOff, Trash2 } from 'lucide-react'
import { BaseCard, Badge, Button } from '@/design-system/UIComponents'
import { documentMasterService } from '@/shared/services/documentMasterService'
import type { DocumentMaster } from '@/shared/types/documentMaster'
import {
  documentStatusColor,
  documentStatusLabel,
} from '../config/documentStatusConfig'
import { formatDocumentDate } from '../utils/documentListingUtils'

interface DocumentDetailSummaryProps {
  document: DocumentMaster
  onEdit: () => void
  onToggleStatus: () => void
  onDelete: () => void
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value || '--'}
      </Typography>
    </Stack>
  )
}

export function DocumentDetailSummary({
  document,
  onEdit,
  onToggleStatus,
  onDelete,
}: DocumentDetailSummaryProps) {
  const usageCount = documentMasterService.getUsageCount(document.id)
  const inUse = usageCount > 0
  const isActive = document.status === 'active'

  return (
    <BaseCard sx={{ p: 2.5 }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack spacing={0.75} sx={{ minWidth: 0 }}>
            <Typography variant="h5" component="h1" fontWeight={700}>
              {document.documentType}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {document.id} · Created {formatDocumentDate(document.createdAt)}
            </Typography>
            {inUse ? (
              <Typography variant="body2" color="text.secondary">
                Referenced in {usageCount} country checklist{usageCount === 1 ? '' : 's'}
              </Typography>
            ) : null}
          </Stack>
          <Badge
            label={documentStatusLabel[document.status]}
            color={documentStatusColor[document.status]}
            sx={{ alignSelf: { xs: 'flex-start', md: 'flex-start' } }}
          />
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <SummaryField label="Document ID" value={document.id} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <SummaryField label="Status" value={documentStatusLabel[document.status]} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <SummaryField label="Created" value={formatDocumentDate(document.createdAt)} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <SummaryField label="Last updated" value={formatDocumentDate(document.updatedAt)} />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            label="Edit"
            variant="contained"
            startIcon={<Pencil size={14} />}
            onClick={onEdit}
          />
          <Button
            label={isActive ? 'Deactivate' : 'Activate'}
            variant="outlined"
            startIcon={isActive ? <PowerOff size={14} /> : <Power size={14} />}
            onClick={onToggleStatus}
          />
          <Button
            label="Delete"
            variant="outlined"
            color="error"
            startIcon={<Trash2 size={14} />}
            onClick={onDelete}
            disabled={inUse}
          />
        </Stack>

        {inUse ? (
          <Typography variant="body2" color="text.secondary">
            This document is referenced in country checklists and cannot be deleted. Deactivate
            it instead if it should no longer be used.
          </Typography>
        ) : null}
      </Stack>
    </BaseCard>
  )
}
