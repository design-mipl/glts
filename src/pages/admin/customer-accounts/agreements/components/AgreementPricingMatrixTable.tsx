import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Copy, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button, Checkbox, FormField, Input, Modal, Select } from '@/design-system/UIComponents'
import type { AgreementPricingRow, CommercialAgreementFormData } from '@/shared/types/commercialAgreement'

interface AgreementPricingMatrixTableProps {
  data: CommercialAgreementFormData
  onChange: (next: CommercialAgreementFormData) => void
}

function newRow(): AgreementPricingRow {
  return {
    id: `pr-${Date.now()}`,
    country: '',
    visaType: 'Marine',
    workflowType: 'Marine',
    serviceFee: 0,
    gstApplicable: true,
    remarks: '',
  }
}

export function AgreementPricingMatrixTable({ data, onChange }: AgreementPricingMatrixTableProps) {
  const [editRow, setEditRow] = useState<AgreementPricingRow | null>(null)

  const updateMatrix = (pricingMatrix: AgreementPricingRow[]) => {
    onChange({ ...data, pricingMatrix })
  }

  const saveEdit = () => {
    if (!editRow) return
    const exists = data.pricingMatrix.some((r) => r.id === editRow.id)
    updateMatrix(
      exists
        ? data.pricingMatrix.map((r) => (r.id === editRow.id ? editRow : r))
        : [...data.pricingMatrix, editRow],
    )
    setEditRow(null)
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight={600}>
          Visa pricing matrix
        </Typography>
        <Button label="Add pricing" size="sm" startIcon={<Plus size={14} />} onClick={() => setEditRow(newRow())} />
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Country</TableCell>
            <TableCell>Visa type</TableCell>
            <TableCell>Workflow</TableCell>
            <TableCell>Service fee</TableCell>
            <TableCell>GST</TableCell>
            <TableCell>Remarks</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.pricingMatrix.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>
                <Typography variant="body2" color="text.secondary">
                  No pricing rows yet. Add pricing to continue.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.pricingMatrix.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.country || '—'}</TableCell>
                <TableCell>{row.visaType}</TableCell>
                <TableCell>{row.workflowType}</TableCell>
                <TableCell>₹{row.serviceFee.toLocaleString('en-IN')}</TableCell>
                <TableCell>{row.gstApplicable ? 'Yes' : 'No'}</TableCell>
                <TableCell>{row.remarks || '—'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setEditRow({ ...row })}>
                    <Pencil size={14} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => updateMatrix([...data.pricingMatrix, { ...row, id: `pr-${Date.now()}` }])}
                  >
                    <Copy size={14} />
                  </IconButton>
                  <IconButton size="small" onClick={() => updateMatrix(data.pricingMatrix.filter((r) => r.id !== row.id))}>
                    <Trash2 size={14} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal
        open={Boolean(editRow)}
        onClose={() => setEditRow(null)}
        title={data.pricingMatrix.some((r) => r.id === editRow?.id) ? 'Edit pricing' : 'Add pricing'}
        footer={
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button label="Cancel" variant="outlined" onClick={() => setEditRow(null)} />
            <Button label="Save" onClick={saveEdit} />
          </Stack>
        }
      >
        {editRow ? (
          <Stack spacing={2}>
            <FormField label="Country" required>
              <Input value={editRow.country} onChange={(v) => setEditRow({ ...editRow, country: v })} fullWidth />
            </FormField>
            <FormField label="Visa type">
              <Input value={editRow.visaType} onChange={(v) => setEditRow({ ...editRow, visaType: v })} fullWidth />
            </FormField>
            <FormField label="Workflow type">
              <Select
                value={editRow.workflowType}
                onChange={(v) => setEditRow({ ...editRow, workflowType: String(v) })}
                options={[
                  { value: 'Marine', label: 'Marine' },
                  { value: 'Corporate', label: 'Corporate' },
                  { value: 'Retail', label: 'Retail' },
                ]}
                fullWidth
              />
            </FormField>
            <FormField label="Service fee (₹)">
              <Input
                type="number"
                value={String(editRow.serviceFee)}
                onChange={(v) => setEditRow({ ...editRow, serviceFee: Number(v) || 0 })}
                fullWidth
              />
            </FormField>
            <Checkbox
              label="GST applicable"
              checked={editRow.gstApplicable}
              onChange={(checked) => setEditRow({ ...editRow, gstApplicable: checked })}
            />
            <FormField label="Remarks">
              <Input value={editRow.remarks} onChange={(v) => setEditRow({ ...editRow, remarks: v })} fullWidth />
            </FormField>
          </Stack>
        ) : null}
      </Modal>
    </Box>
  )
}
