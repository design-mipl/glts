import { Box, Stack, Typography } from '@mui/material'
import { Badge, Button, Modal } from '@/design-system/UIComponents'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { statusMasterService } from '@/shared/services/statusMasterService'
import type { WorkflowMaster } from '@/shared/types/workflowMaster'
import { masterStatusColor, masterStatusLabel } from '../../config/masterStatusConfig'
import { formatMasterDate } from '../../utils/masterListingUtils'

interface WorkflowViewModalProps {
  open: boolean
  record: WorkflowMaster | null
  onClose: () => void
  onEdit: (record: WorkflowMaster) => void
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

export function WorkflowViewModal({ open, record, onClose, onEdit }: WorkflowViewModalProps) {
  if (!record) return null

  const steps = [...record.steps].sort((a, b) => a.sequence - b.sequence)
  const stepCount = steps.length

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={record.name}
      subtitle={`${stepCount} status${stepCount === 1 ? '' : 'es'} in this workflow`}
      size={ADMIN_MODAL_FORM_LAYOUT.recommendedSize}
      footer={
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, width: '100%' }}>
          <Button label="Close" variant="neutral" onClick={onClose} />
          <Button
            label="Edit"
            onClick={() => {
              onClose()
              onEdit(record)
            }}
          />
        </Box>
      }
    >
      <Stack spacing={2.5}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <SummaryField label="Workflow name" value={record.name} />
          <Stack spacing={0.25}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              Status
            </Typography>
            <Box>
              <Badge
                label={masterStatusLabel[record.status]}
                color={masterStatusColor[record.status]}
                size="sm"
              />
            </Box>
          </Stack>
          <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
            <SummaryField label="Description" value={record.description} />
          </Box>
          <SummaryField
            label="Created"
            value={`${record.createdBy} · ${formatMasterDate(record.createdAt)}`}
          />
          <SummaryField
            label="Updated"
            value={`${record.updatedBy} · ${formatMasterDate(record.updatedAt)}`}
          />
        </Box>

        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            Workflow statuses ({stepCount})
          </Typography>
          {steps.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              No statuses configured for this workflow.
            </Typography>
          ) : (
            <Stack
              spacing={1}
              sx={{
                maxHeight: 280,
                overflowY: 'auto',
                pr: 0.5,
              }}
            >
              {steps.map((step) => {
                const statusName =
                  statusMasterService.getById(step.statusId)?.name ?? step.statusId
                return (
                  <Box
                    key={`${step.statusId}-${step.sequence}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1.25,
                      px: 1.5,
                      py: 1.25,
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{ fontSize: 13, minWidth: 28, color: 'text.secondary' }}
                    >
                      {step.sequence}
                    </Typography>
                    <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                        {statusName}
                      </Typography>
                      {step.remarks ? (
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                          {step.remarks}
                        </Typography>
                      ) : null}
                    </Stack>
                  </Box>
                )
              })}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Modal>
  )
}
