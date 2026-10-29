import {
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge, Button } from '@/design-system/UIComponents'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import type { FormAssistVfsServiceChargeLine } from '@/shared/services/applicationFormAssistService'
import { formatVfsGstLabel } from '@/shared/utils/countryVfsServiceRateUtils'
import { formatPaymentAmountInr, sumServiceAmounts } from '../../utils/pendingPaymentUtils'
import { SelectPaymentServicesModal } from './SelectPaymentServicesModal'

const paymentServicesTableTotalRowCellSx = {
  fontSize: 13,
  fontWeight: 600,
  borderBottom: 0,
  borderTop: 1,
  borderColor: 'divider',
  bgcolor: 'action.hover',
  pt: 1.25,
  pb: 1.25,
} as const

interface PaymentEntryServicesSectionProps {
  catalog: FormAssistVfsServiceChargeLine[]
  selectedServiceIds: string[]
  availableServices: FormAssistVfsServiceChargeLine[]
  onChange: (serviceIds: string[]) => void
}

export function PaymentEntryServicesSection({
  catalog,
  selectedServiceIds,
  availableServices,
  onChange,
}: PaymentEntryServicesSectionProps) {
  const [addModalOpen, setAddModalOpen] = useState(false)

  const selectedServices = useMemo(
    () => catalog.filter(line => selectedServiceIds.includes(line.id)),
    [catalog, selectedServiceIds],
  )

  const addableServices = useMemo(
    () => availableServices.filter(line => !selectedServiceIds.includes(line.id)),
    [availableServices, selectedServiceIds],
  )

  const totalAmount = useMemo(
    () => sumServiceAmounts(catalog, selectedServiceIds),
    [catalog, selectedServiceIds],
  )

  const removeService = (serviceId: string) => {
    onChange(selectedServiceIds.filter(id => id !== serviceId))
  }

  const addServices = (serviceIds: string[]) => {
    onChange([...new Set([...selectedServiceIds, ...serviceIds])])
    setAddModalOpen(false)
  }

  return (
    <>
      <Stack spacing={0.75}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
            VFS Charges & Services
            <Typography component="span" color="error.main" sx={{ ml: 0.25 }}>
              *
            </Typography>
          </Typography>
          {addableServices.length > 0 ? (
            <Button
              label="Add service"
              size="sm"
              startIcon={<Plus size={14} />}
              onClick={() => setAddModalOpen(true)}
            />
          ) : null}
        </Stack>

        <Box sx={agreementEmbeddedTableSx}>
          {selectedServices.length === 0 ? (
            <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                {availableServices.length === 0
                  ? 'No unpaid services available for this payment.'
                  : 'No services added yet. Use Add service to include unpaid VFS charges.'}
              </Typography>
            </Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service name</TableCell>
                  <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                    Rate
                  </TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>GST</TableCell>
                  <TableCell align="right" sx={{ ...agreementEmbeddedTableHeadCellSx, width: 72 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedServices.map(line => (
                  <TableRow key={line.id} hover>
                    <TableCell sx={{ fontSize: 13 }}>{line.serviceName}</TableCell>
                    <TableCell align="right" sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
                      {formatPaymentAmountInr(line.amount)}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      <Badge
                        label={formatVfsGstLabel(line.gstIncluded ?? false)}
                        color={line.gstIncluded ? 'success' : 'neutral'}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        aria-label={`Remove ${line.serviceName}`}
                        onClick={() => removeService(line.id)}
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell sx={paymentServicesTableTotalRowCellSx}>Payment total</TableCell>
                  <TableCell
                    align="right"
                    sx={{ ...paymentServicesTableTotalRowCellSx, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {formatPaymentAmountInr(totalAmount)}
                  </TableCell>
                  <TableCell sx={paymentServicesTableTotalRowCellSx} />
                  <TableCell sx={paymentServicesTableTotalRowCellSx} />
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </Box>
      </Stack>

      <SelectPaymentServicesModal
        open={addModalOpen}
        availableServices={addableServices}
        onClose={() => setAddModalOpen(false)}
        onAdd={addServices}
      />
    </>
  )
}
