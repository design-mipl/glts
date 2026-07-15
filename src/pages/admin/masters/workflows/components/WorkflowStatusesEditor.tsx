import { useState } from 'react'
import {
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { Button, FormField, Input, Textarea } from '@/design-system/UIComponents'
import { statusMasterService } from '@/shared/services/statusMasterService'
import type { WorkflowStatusStepFormData } from '@/shared/types/workflowMaster'

interface WorkflowStatusesEditorProps {
  steps: WorkflowStatusStepFormData[]
  error?: string
  onChange: (steps: WorkflowStatusStepFormData[]) => void
}

function resolveStatusId(input: string): string {
  const normalized = input.trim().toLowerCase()
  const match = statusMasterService
    .list()
    .find((row) => row.name.trim().toLowerCase() === normalized)
  return match?.id ?? input.trim()
}

function isStatusAlreadyInWorkflow(resolvedId: string, existingStatusIds: string[]): boolean {
  if (existingStatusIds.includes(resolvedId)) return true
  const resolvedName = (
    statusMasterService.getById(resolvedId)?.name ?? resolvedId
  )
    .trim()
    .toLowerCase()
  return existingStatusIds.some((id) => {
    const name = (statusMasterService.getById(id)?.name ?? id).trim().toLowerCase()
    return name === resolvedName
  })
}

function reorderSteps(
  steps: WorkflowStatusStepFormData[],
  index: number,
  direction: 'up' | 'down',
): WorkflowStatusStepFormData[] {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= steps.length) return steps
  const next = [...steps]
  ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
  return next
}

export function WorkflowStatusesEditor({
  steps,
  error,
  onChange,
}: WorkflowStatusesEditorProps) {
  const [statusName, setStatusName] = useState('')
  const [remarks, setRemarks] = useState('')
  const [addError, setAddError] = useState('')

  const handleAdd = () => {
    if (!statusName.trim()) {
      setAddError('Status is required')
      return
    }
    const statusId = resolveStatusId(statusName)
    if (isStatusAlreadyInWorkflow(statusId, steps.map((step) => step.statusId))) {
      setAddError('This status is already in the workflow')
      return
    }
    onChange([...steps, { statusId, remarks: remarks.trim() }])
    setStatusName('')
    setRemarks('')
    setAddError('')
  }

  return (
    <Stack spacing={1.5} sx={{ width: '100%' }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
        Configure the sequence of processing statuses for this workflow.
      </Typography>

      {error ? (
        <Typography variant="caption" color="error" sx={{ fontSize: 12 }}>
          {error}
        </Typography>
      ) : null}

      {steps.length === 0 ? (
        <Box
          sx={{
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1.25,
            px: 2,
            py: 2.5,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            No statuses added yet. Enter a status below to build the sequence.
          </Typography>
        </Box>
      ) : (
        <Table size="small" sx={{ '& th, & td': { fontSize: 13, py: 1, px: 1.25 } }}>
          <TableHead>
            <TableRow>
              <TableCell width={72}>Sequence</TableCell>
              <TableCell>Status</TableCell>
              <TableCell width={120} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {steps.map((step, index) => {
              const name = statusMasterService.getById(step.statusId)?.name ?? step.statusId
              return (
                <TableRow key={`${step.statusId}-${index}`}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                      {name}
                    </Typography>
                    {step.remarks ? (
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                        {step.remarks}
                      </Typography>
                    ) : null}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                      <IconButton
                        size="small"
                        disabled={index === 0}
                        onClick={() => onChange(reorderSteps(steps, index, 'up'))}
                        aria-label="Move up"
                      >
                        <ChevronUp size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        disabled={index === steps.length - 1}
                        onClick={() => onChange(reorderSteps(steps, index, 'down'))}
                        aria-label="Move down"
                      >
                        <ChevronDown size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onChange(steps.filter((_, i) => i !== index))}
                        aria-label="Delete status"
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}

      <Stack spacing={1.25}>
        <FormField label="Status" required error={Boolean(addError)} helperText={addError}>
          <Input
            value={statusName}
            onChange={(v) => {
              setStatusName(v)
              setAddError('')
            }}
            placeholder="e.g. Under Review"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Remarks" optional>
          <Textarea
            value={remarks}
            onChange={setRemarks}
            placeholder="Optional notes for this status step"
            rows={2}
            fullWidth
          />
        </FormField>
        <Box>
          <Button
            label="Add Status"
            startIcon={<Plus size={14} />}
            onClick={handleAdd}
            size="sm"
          />
        </Box>
      </Stack>
    </Stack>
  )
}
