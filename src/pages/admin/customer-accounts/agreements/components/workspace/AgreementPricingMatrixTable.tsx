import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Copy, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button, Checkbox, FormField, FormSection, Input, Modal, Select } from '@/design-system/UIComponents'
import type { AgreementPricingRow, CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import {
  getCountrySelectOptions,
  getServiceOptions,
  getVisaTypeOptions,
  resolveServiceFee,
  workflowTypeDisplayLabel,
} from '../../utils/agreementMasterOptions'
import { agreementEmbeddedTableHeadCellSx, agreementEmbeddedTableSx } from '../agreementFormLayout'

interface AgreementPricingMatrixTableProps {
  data: CommercialAgreementFormData
  errors: Record<string, string>
  onChange: (next: CommercialAgreementFormData) => void
  readOnly?: boolean
}

function newRow(workflowType: CommercialAgreementFormData['workflowType']): AgreementPricingRow {
  return {
    id: `pr-${Date.now()}`,
    country: '',
    countryId: '',
    visaType: '',
    workflowType: workflowTypeDisplayLabel(workflowType),
    servicePresetId: '',
    servicePresetName: '',
    serviceFee: 0,
    gstApplicable: true,
    remarks: '',
  }
}

export function AgreementPricingMatrixTable({
  data,
  errors,
  onChange,
  readOnly = false,
}: AgreementPricingMatrixTableProps) {
  const [editRow, setEditRow] = useState<AgreementPricingRow | null>(null)
  const countryOptions = useMemo(() => getCountrySelectOptions(), [])
  const serviceOptions = useMemo(() => getServiceOptions(data.workflowType), [data.workflowType])

  const visaOptions = useMemo(() => {
    if (!editRow?.countryId) return []
    return getVisaTypeOptions(editRow.countryId, data.workflowType)
  }, [editRow?.countryId, data.workflowType])

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
    <Box sx={{ width: '100%' }}>
      {!readOnly ? (
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1.5 }}>
          <Button label="Add pricing" size="sm" startIcon={<Plus size={14} />} onClick={() => setEditRow(newRow(data.workflowType))} />
        </Stack>
      ) : null}

      {errors.pricingMatrix ? (
        <Typography variant="caption" color="error.main" sx={{ mb: 1, display: 'block' }}>
          {errors.pricingMatrix}
        </Typography>
      ) : null}

      <Box sx={agreementEmbeddedTableSx}>
        {data.pricingMatrix.length === 0 ? (
          <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: 13 }}>
              No pricing rows yet. Add at least one country, visa type, and service from Service Master.
            </Typography>
            {!readOnly ? (
              <Button label="Add pricing" size="sm" startIcon={<Plus size={14} />} onClick={() => setEditRow(newRow(data.workflowType))} />
            ) : null}
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Country</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Visa type</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Workflow</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service fee</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>GST</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Remarks</TableCell>
                {!readOnly ? (
                  <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                    Actions
                  </TableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.pricingMatrix.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontSize: 13 }}>{row.country || '—'}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{row.visaType || '—'}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{row.workflowType}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{row.servicePresetName || '—'}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>₹{row.serviceFee.toLocaleString('en-IN')}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{row.gstApplicable ? 'Yes' : 'No'}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{row.remarks || '—'}</TableCell>
                  {!readOnly ? (
                    <TableCell align="right">
                      <IconButton size="small" aria-label="Edit pricing row" onClick={() => setEditRow({ ...row })}>
                        <Pencil size={14} />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="Clone pricing row"
                        onClick={() => updateMatrix([...data.pricingMatrix, { ...row, id: `pr-${Date.now()}` }])}
                      >
                        <Copy size={14} />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="Remove pricing row"
                        onClick={() => updateMatrix(data.pricingMatrix.filter((r) => r.id !== row.id))}
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      <Modal
        open={Boolean(editRow)}
        onClose={() => setEditRow(null)}
        title={data.pricingMatrix.some((r) => r.id === editRow?.id) ? 'Edit pricing' : 'Add pricing'}
        footer={
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button label="Cancel" variant="outlined" color="secondary" onClick={() => setEditRow(null)} />
            <Button label="Save" onClick={saveEdit} />
          </Stack>
        }
      >
        {editRow ? (
          <FormSection columns={2}>
            <FormField label="Country" required>
              <Select
                value={editRow.countryId ?? ''}
                onChange={(v) => {
                  const countryId = String(v)
                  const country = countryOptions.find((c) => c.value === countryId)
                  setEditRow({
                    ...editRow,
                    countryId,
                    country: country?.countryName ?? '',
                    visaType: '',
                  })
                }}
                options={[{ value: '', label: 'Select country' }, ...countryOptions.map((c) => ({ value: c.value, label: c.label }))]}
                placeholder="Select country"
                fullWidth
              />
            </FormField>
            <FormField label="Visa type" required>
              <Select
                value={editRow.visaType}
                onChange={(v) => setEditRow({ ...editRow, visaType: String(v) })}
                options={[{ value: '', label: 'Select visa type' }, ...visaOptions]}
                placeholder="Select visa type"
                fullWidth
                disabled={!editRow.countryId}
              />
            </FormField>
            <FormField label="Service" required>
              <Select
                value={editRow.servicePresetId}
                onChange={(v) => {
                  const serviceId = String(v)
                  const service = serviceOptions.find((s) => s.value === serviceId)
                  setEditRow({
                    ...editRow,
                    servicePresetId: serviceId,
                    servicePresetName: service?.label ?? '',
                    serviceFee: resolveServiceFee(serviceId),
                  })
                }}
                options={serviceOptions.map((s) => ({ value: s.value, label: s.label }))}
                placeholder={serviceOptions.length === 0 ? 'No services for this workflow' : 'Select service'}
                fullWidth
                clearable
              />
            </FormField>
            <FormField label="Service fee (₹)">
              <Input
                type="number"
                value={String(editRow.serviceFee)}
                onChange={(v) => setEditRow({ ...editRow, serviceFee: Number(v) || 0 })}
                placeholder="Enter service fee"
                fullWidth
              />
            </FormField>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Checkbox
                label="GST applicable"
                checked={editRow.gstApplicable}
                onChange={(checked) => setEditRow({ ...editRow, gstApplicable: checked })}
              />
            </Box>
            <FormField label="Remarks">
              <Input
                value={editRow.remarks}
                onChange={(v) => setEditRow({ ...editRow, remarks: v })}
                placeholder="Optional remarks"
                fullWidth
              />
            </FormField>
          </FormSection>
        ) : null}
      </Modal>
    </Box>
  )
}
