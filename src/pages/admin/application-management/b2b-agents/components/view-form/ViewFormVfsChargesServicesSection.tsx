import {
  Box,
  IconButton,
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
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import type { FormAssistVfsServiceChargeLine } from '@/shared/services/applicationFormAssistService'
import { formatVfsGstLabel } from '@/shared/utils/countryVfsServiceRateUtils'
import { AddVfsServicesModal } from './AddVfsServicesModal'

interface ViewFormVfsChargesServicesSectionProps {
  country: string
  visaType: string
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
  serviceCharges: FormAssistVfsServiceChargeLine[]
  onChange: (serviceCharges: FormAssistVfsServiceChargeLine[]) => void
  readOnly?: boolean
}

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

const vfsTableTotalRowCellSx = {
  fontSize: 13,
  fontWeight: 600,
  borderBottom: 0,
  borderTop: 1,
  borderColor: 'divider',
  bgcolor: 'action.hover',
  pt: 1.25,
  pb: 1.25,
} as const

export function ViewFormVfsChargesServicesSection({
  country,
  visaType,
  countryId,
  visaOfferingId,
  jurisdictionId,
  serviceCharges,
  onChange,
  readOnly = false,
}: ViewFormVfsChargesServicesSectionProps) {
  const [addModalOpen, setAddModalOpen] = useState(false)

  const totalAmount = useMemo(
    () => serviceCharges.reduce((sum, line) => sum + line.amount, 0),
    [serviceCharges],
  )

  const removeRow = (id: string) => {
    onChange(serviceCharges.filter((line) => line.id !== id))
  }

  const addServices = (lines: FormAssistVfsServiceChargeLine[]) => {
    onChange([...serviceCharges, ...lines])
    setAddModalOpen(false)
  }

  return (
    <>
      <AdminOverlayFormSection
        title="VFS Charges & Services"
        columns={1}
        importance="secondary"
        headerAction={
          readOnly ? undefined : (
            <Button
              label="Add service"
              size="sm"
              startIcon={<Plus size={14} />}
              onClick={() => setAddModalOpen(true)}
            />
          )
        }
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={agreementEmbeddedTableSx}>
            {serviceCharges.length === 0 ? (
              <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  No VFS services added yet for {country || 'this country'} · {visaType || 'visa type'}.
                  Configure services in Country Master or use Add service above.
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
                    {!readOnly ? (
                      <TableCell align="right" sx={{ ...agreementEmbeddedTableHeadCellSx, width: 72 }}>
                        Actions
                      </TableCell>
                    ) : null}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceCharges.map((line) => (
                    <TableRow key={line.id} hover>
                      <TableCell sx={{ fontSize: 13 }}>{line.serviceName}</TableCell>
                      <TableCell align="right" sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
                        {formatInr(line.amount)}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        <Badge
                          label={formatVfsGstLabel(line.gstIncluded ?? false)}
                          color={line.gstIncluded ? 'success' : 'neutral'}
                          size="sm"
                        />
                      </TableCell>
                      {!readOnly ? (
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            aria-label={`Remove ${line.serviceName}`}
                            onClick={() => removeRow(line.id)}
                          >
                            <Trash2 size={14} />
                          </IconButton>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell sx={vfsTableTotalRowCellSx}>Total service charges</TableCell>
                    <TableCell align="right" sx={{ ...vfsTableTotalRowCellSx, fontVariantNumeric: 'tabular-nums' }}>
                      {formatInr(totalAmount)}
                    </TableCell>
                    <TableCell sx={vfsTableTotalRowCellSx} />
                    {!readOnly ? <TableCell sx={vfsTableTotalRowCellSx} /> : null}
                  </TableRow>
                </TableFooter>
              </Table>
            )}
          </Box>
        </Box>
      </AdminOverlayFormSection>

      {!readOnly ? (
        <AddVfsServicesModal
          open={addModalOpen}
          country={country}
          visaType={visaType}
          countryId={countryId}
          visaOfferingId={visaOfferingId}
          jurisdictionId={jurisdictionId}
          existingCharges={serviceCharges}
          onClose={() => setAddModalOpen(false)}
          onAdd={addServices}
        />
      ) : null}
    </>
  )
}
