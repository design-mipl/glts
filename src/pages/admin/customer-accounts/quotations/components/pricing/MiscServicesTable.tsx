import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { Pencil, Trash2 } from 'lucide-react'
import { IconButton } from '@/design-system/UIComponents'
import type { QuotationServiceLine } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableScrollSx,
  agreementEmbeddedTableSx,
} from '../../../agreements/components/agreementFormLayout'

interface MiscServicesTableProps {
  services: QuotationServiceLine[]
  onEdit?: () => void
  onDelete?: (serviceId: string) => void
  readOnly?: boolean
}

export function MiscServicesTable({ services, onEdit, onDelete, readOnly }: MiscServicesTableProps) {
  return (
    <Box sx={agreementEmbeddedTableSx}>
      <Box sx={{ ...agreementEmbeddedTableScrollSx, maxHeight: 360 }}>
        <Table size="small" sx={{ minWidth: 560 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx} align="right">
                Amount
              </TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>GST</TableCell>
              {!readOnly ? (
                <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                  Actions
                </TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((svc) => (
              <TableRow key={svc.id} hover>
                <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>{svc.serviceName}</TableCell>
                <TableCell align="right" sx={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {formatInr(svc.amount)}
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>{svc.gstApplicable ? 'Yes' : 'No'}</TableCell>
                {!readOnly ? (
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                      {onEdit ? (
                        <IconButton
                          tooltip="Edit"
                          size="sm"
                          variant="soft"
                          icon={<Pencil size={14} />}
                          onClick={onEdit}
                        />
                      ) : null}
                      {onDelete ? (
                        <IconButton
                          tooltip="Delete"
                          size="sm"
                          variant="soft"
                          icon={<Trash2 size={14} />}
                          onClick={() => onDelete(svc.id)}
                        />
                      ) : null}
                    </Stack>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  )
}
