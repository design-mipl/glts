import { useMemo, useState } from 'react'
import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { PencilLine, Plus, Trash2 } from 'lucide-react'
import { Badge, Button, IconButton } from '@/design-system/UIComponents'
import { serviceMasterService } from '@/shared/services/serviceMasterService'
import type { VendorFormData, VendorServiceMapping } from '@/shared/types/vendor'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import { VendorServiceMappingModal } from './VendorServiceMappingModal'

interface VendorServiceMappingSectionProps {
  data: VendorFormData
  onChange: (next: VendorFormData) => void
}

export function useVendorServiceMappingSection({ data, onChange }: VendorServiceMappingSectionProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editMapping, setEditMapping] = useState<VendorServiceMapping | null>(null)

  const usedServiceIds = useMemo(
    () => data.serviceMappings.map(m => m.serviceMasterId).filter(id => id !== editMapping?.serviceMasterId),
    [data.serviceMappings, editMapping?.serviceMasterId],
  )

  const openAdd = () => {
    setEditMapping(null)
    setModalOpen(true)
  }

  const openEdit = (mapping: VendorServiceMapping) => {
    setEditMapping(mapping)
    setModalOpen(true)
  }

  const handleSave = (mapping: VendorServiceMapping) => {
    const exists = data.serviceMappings.some(m => m.id === mapping.id)
    const nextMappings = exists
      ? data.serviceMappings.map(m => (m.id === mapping.id ? mapping : m))
      : [...data.serviceMappings, mapping]
    onChange({ ...data, serviceMappings: nextMappings })
  }

  const handleRemove = (mappingId: string) => {
    onChange({ ...data, serviceMappings: data.serviceMappings.filter(m => m.id !== mappingId) })
  }

  const headerAction = (
    <Button label="Add service" size="sm" startIcon={<Plus size={14} />} onClick={openAdd} />
  )

  const content = (
    <>
      {data.serviceMappings.length === 0 ? (
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            No services mapped yet. Adding services is optional — you can do this later.
          </Typography>
        </Box>
      ) : (
        <Box sx={agreementEmbeddedTableSx}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx} align="right">
                  Vendor rate
                </TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>GST</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Status</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.serviceMappings.map(mapping => {
                const service = serviceMasterService.getById(mapping.serviceMasterId)
                return (
                  <TableRow key={mapping.id}>
                    <TableCell>{service?.serviceName ?? mapping.serviceMasterId}</TableCell>
                    <TableCell align="right">{formatInr(mapping.vendorRate)}</TableCell>
                    <TableCell>
                      <Badge
                        label={mapping.gstApplicable ? 'Yes' : 'No'}
                        color={mapping.gstApplicable ? 'success' : 'neutral'}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Badge
                        label={mapping.status === 'active' ? 'Active' : 'Inactive'}
                        color={mapping.status === 'active' ? 'success' : 'neutral'}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <IconButton
                          icon={<PencilLine size={14} />}
                          tooltip="Edit mapping"
                          onClick={() => openEdit(mapping)}
                        />
                        <IconButton
                          icon={<Trash2 size={14} />}
                          tooltip="Remove mapping"
                          onClick={() => handleRemove(mapping.id)}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
      )}

      <VendorServiceMappingModal
        open={modalOpen}
        mapping={editMapping}
        usedServiceIds={usedServiceIds}
        onClose={() => {
          setModalOpen(false)
          setEditMapping(null)
        }}
        onSave={handleSave}
      />
    </>
  )

  return { headerAction, content }
}

export function VendorServiceMappingSection(props: VendorServiceMappingSectionProps) {
  const { headerAction, content } = useVendorServiceMappingSection(props)

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        {headerAction}
      </Stack>
      {content}
    </Stack>
  )
}
