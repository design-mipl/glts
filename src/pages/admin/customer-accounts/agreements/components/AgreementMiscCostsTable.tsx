import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button, Checkbox, FormField, FormSection, Input, Modal, Select } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { AgreementMiscCostRow, CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { agreementEmbeddedTableHeadCellSx, agreementEmbeddedTableSx } from './agreementFormLayout'

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
    <Box sx={{ gridColumn: '1 / -1', width: '100%' }}>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1.5 }}>
        <Button label="Add service" size="sm" startIcon={<Plus size={14} />} onClick={() => setEditRow(newRow())} />
      </Stack>

      <Box sx={agreementEmbeddedTableSx}>
        {data.miscellaneousCosts.length === 0 ? (
          <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: 13 }}>
              No miscellaneous costs added. Optional add-on charges can be configured here.
            </Typography>
            <Button label="Add service" size="sm" startIcon={<Plus size={14} />} onClick={() => setEditRow(newRow())} />
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service name</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Pricing type</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Amount</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>GST</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Remarks</TableCell>
                <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.miscellaneousCosts.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontSize: 13 }}>{row.serviceName}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{row.pricingType}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>₹{row.amount.toLocaleString('en-IN')}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{row.gstApplicable ? 'Yes' : 'No'}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{row.remarks || '—'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" aria-label="Edit service" onClick={() => setEditRow({ ...row })}>
                      <Pencil size={14} />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label="Remove service"
                      onClick={() => updateCosts(data.miscellaneousCosts.filter((r) => r.id !== row.id))}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      <Modal
        open={Boolean(editRow)}
        onClose={() => setEditRow(null)}
        title="Miscellaneous service"
        footer={
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button label="Cancel" variant="outlined" color="secondary" onClick={() => setEditRow(null)} />
            <Button label="Save" onClick={saveEdit} />
          </Stack>
        }
      >
        {editRow ? (
          <FormSection columns={2}>
            <FormField label="Service preset">
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
            <AdminFullPageFormFieldSpan>
              <FormField label="Remarks" optional>
                <Input value={editRow.remarks} onChange={(v) => setEditRow({ ...editRow, remarks: v })} fullWidth />
              </FormField>
            </AdminFullPageFormFieldSpan>
          </FormSection>
        ) : null}
      </Modal>
    </Box>
  )
}
