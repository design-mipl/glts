import { useState } from 'react'
import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { PencilLine, Plus } from 'lucide-react'
import { Badge, Button, IconButton } from '@/design-system/UIComponents'
import { serviceMasterService } from '@/shared/services/serviceMasterService'
import { vendorService } from '@/shared/services/vendorService'
import type { Vendor, VendorServiceMapping } from '@/shared/types/vendor'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import { VendorServiceMappingModal } from '../VendorServiceMappingModal'

interface VendorServicesRatesTabProps {
  vendor: Vendor
  onUpdated: () => void
}

export function VendorServicesRatesTab({ vendor, onUpdated }: VendorServicesRatesTabProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editMapping, setEditMapping] = useState<VendorServiceMapping | null>(null)

  const usedServiceIds = vendor.serviceMappings
    .map((m) => m.serviceMasterId)
    .filter((id) => id !== editMapping?.serviceMasterId)

  const handleSave = (mapping: VendorServiceMapping) => {
    const exists = vendor.serviceMappings.some((m) => m.id === mapping.id)
    if (exists) {
      vendorService.updateServiceMapping(vendor.id, mapping.id, mapping)
    } else {
      vendorService.addServiceMapping(vendor.id, mapping)
    }
    onUpdated()
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="flex-end">
        <Button
          label="Add service"
          startIcon={<Plus size={14} />}
          onClick={() => {
            setEditMapping(null)
            setModalOpen(true)
          }}
        />
      </Stack>

      {vendor.serviceMappings.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>No services mapped to this vendor.</Box>
      ) : (
        <Box sx={agreementEmbeddedTableSx}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service name</TableCell>
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
              {vendor.serviceMappings.map((mapping) => {
                const service = serviceMasterService.getById(mapping.serviceMasterId)
                return (
                  <TableRow key={mapping.id}>
                    <TableCell>{service?.serviceName ?? mapping.serviceMasterId}</TableCell>
                    <TableCell align="right">{formatInr(mapping.vendorRate)}</TableCell>
                    <TableCell>
                      <Badge label={mapping.gstApplicable ? 'Yes' : 'No'} color={mapping.gstApplicable ? 'success' : 'neutral'} size="sm" />
                    </TableCell>
                    <TableCell>
                      <Badge label={mapping.status === 'active' ? 'Active' : 'Inactive'} color={mapping.status === 'active' ? 'success' : 'neutral'} size="sm" />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        icon={<PencilLine size={14} />}
                        tooltip="Edit mapping"
                        onClick={() => {
                          setEditMapping(mapping)
                          setModalOpen(true)
                        }}
                      />
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
    </Stack>
  )
}
