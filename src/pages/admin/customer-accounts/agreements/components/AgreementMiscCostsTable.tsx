import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button, Checkbox, FormField, Input, Modal, Select } from '@/design-system/UIComponents'
import type { AgreementMiscCostRow, CommercialAgreementFormData } from '@/shared/types/commercialAgreement'

interface AgreementMiscCostsTableProps {
  data: CommercialAgreementFormData
  onChange: (next: CommercialAgreementFormData) => void
}

const PRESETS = ['Courier Charges', 'E-Ticket Charges', 'Travel Insurance', 'Airport Assistance', 'Photo Making', 'Others']

function newRow(): AgreementMiscCostRow {
  return {
    id: `mc-${Date.now()}`,
    serviceName: '',
    pricingType: 'fixed',
    amount: 0,
    gstApplicable: true,
    remarks: '',
  }
}

export function AgreementMiscCostsTable({ data, onChange }: AgreementMiscCostsTableProps) {
  const [editRow, setEditRow] = useState<AgreementMiscCostRow | null>(null)

  const updateCosts = (miscellaneousCosts: AgreementMiscCostRow[]) => {
    onChange({ ...data, miscellaneousCosts })
  }

  const saveEdit = () => {
    if (!editRow) return
    const exists = data.miscellaneousCosts.some((r) => r.id === editRow.id)
    updateCosts(
      exists
        ? data.miscellaneousCosts.map((r) => (r.id === editRow.id ? editRow : r))
        : [...data.miscellaneousCosts, editRow],
    )
    setEditRow(null)
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight={600}>
          Miscellaneous services
        </Typography>
        <Button label="Add service" size="sm" startIcon={<Plus size={14} />} onClick={() => setEditRow(newRow())} />
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Service name</TableCell>
            <TableCell>Pricing type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>GST</TableCell>
            <TableCell>Remarks</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.miscellaneousCosts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography variant="body2" color="text.secondary">
                  No miscellaneous costs added.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.miscellaneousCosts.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.serviceName}</TableCell>
                <TableCell>{row.pricingType}</TableCell>
                <TableCell>₹{row.amount.toLocaleString('en-IN')}</TableCell>
                <TableCell>{row.gstApplicable ? 'Yes' : 'No'}</TableCell>
                <TableCell>{row.remarks || '—'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setEditRow({ ...row })}>
                    <Pencil size={14} />
                  </IconButton>
                  <IconButton size="small" onClick={() => updateCosts(data.miscellaneousCosts.filter((r) => r.id !== row.id))}>
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
        title="Miscellaneous service"
        footer={
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button label="Cancel" variant="outlined" onClick={() => setEditRow(null)} />
            <Button label="Save" onClick={saveEdit} />
          </Stack>
        }
      >
        {editRow ? (
          <Stack spacing={2}>
            <FormField label="Service name">
              <Select
                value={editRow.serviceName}
                onChange={(v) => setEditRow({ ...editRow, serviceName: String(v) })}
                options={[{ value: '', label: 'Select preset' }, ...PRESETS.map((p) => ({ value: p, label: p }))]}
                fullWidth
              />
            </FormField>
            <FormField label="Custom service name">
              <Input
                value={editRow.serviceName}
                onChange={(v) => setEditRow({ ...editRow, serviceName: v })}
                placeholder="Service name"
                fullWidth
              />
            </FormField>
            <FormField label="Pricing type">
              <Select
                value={editRow.pricingType}
                onChange={(v) => setEditRow({ ...editRow, pricingType: v as AgreementMiscCostRow['pricingType'] })}
                options={[
                  { value: 'fixed', label: 'Fixed' },
                  { value: 'per_unit', label: 'Per unit' },
                  { value: 'percentage', label: 'Percentage' },
                ]}
                fullWidth
              />
            </FormField>
            <FormField label="Amount (₹)">
              <Input
                type="number"
                value={String(editRow.amount)}
                onChange={(v) => setEditRow({ ...editRow, amount: Number(v) || 0 })}
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
