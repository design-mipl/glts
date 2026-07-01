import { useMemo, useState } from 'react'
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
import { Plus, Trash2 } from 'lucide-react'
import { Badge, Button } from '@/design-system/UIComponents'
import { AddVfsServiceRateModal } from '@/pages/admin/components/AddVfsServiceRateModal'
import type { VfsServiceRateFormValues } from '@/pages/admin/components/AddVfsServiceRateModal'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import { generateVfsServiceRateId } from '@/shared/data/countryJurisdictionDefaults'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type {
  BusinessSegment,
  CountryMasterFormData,
  CountryVfsServiceRate,
} from '@/shared/types/countryMaster'
import { formatVfsGstLabel } from '@/shared/utils/countryVfsServiceRateUtils'
import type { VisaConfigurationScope } from './VisaConfigurationDocumentsTab'

interface VisaConfigurationVfsRatesTabProps {
  scope: VisaConfigurationScope
  countryId: string
  segment: BusinessSegment
  visaTypeId: string
  jurisdictionId?: string
  formData: CountryMasterFormData
  onRefresh: () => void
  readOnly: boolean
}

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function VisaConfigurationVfsRatesTab({
  scope,
  countryId,
  segment,
  visaTypeId,
  jurisdictionId,
  formData,
  onRefresh,
  readOnly,
}: VisaConfigurationVfsRatesTabProps) {
  const [addModalOpen, setAddModalOpen] = useState(false)

  const segConfig = formData.segments.find((s) => s.segment === segment)
  const visaType = segConfig?.visaTypes.find((v) => v.id === visaTypeId)
  const jurisdiction =
    scope === 'jurisdiction' && jurisdictionId
      ? visaType?.jurisdictions?.find((j) => j.id === jurisdictionId)
      : undefined

  const rates = useMemo(() => {
    const source =
      scope === 'jurisdiction' ? jurisdiction?.vfsServiceRates : visaType?.vfsServiceRates
    return [...(source ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)
  }, [jurisdiction?.vfsServiceRates, scope, visaType?.vfsServiceRates])

  if (!visaType) return null
  if (scope === 'jurisdiction' && !jurisdiction) return null

  const persistRates = (nextRates: CountryVfsServiceRate[]) => {
    countryMasterAdminService.saveVfsServiceRates(
      countryId,
      segment,
      visaTypeId,
      nextRates.map((rate, index) => ({ ...rate, sortOrder: index })),
      scope === 'jurisdiction' ? jurisdictionId : undefined,
    )
    onRefresh()
  }

  const removeRate = (rateId: string) => {
    persistRates(rates.filter((rate) => rate.id !== rateId))
  }

  const addRate = (values: VfsServiceRateFormValues) => {
    persistRates([
      ...rates,
      {
        id: generateVfsServiceRateId(),
        serviceName: values.serviceName,
        amount: values.amount,
        gstIncluded: values.gstIncluded,
        sortOrder: rates.length,
      },
    ])
    setAddModalOpen(false)
  }

  return (
    <Stack spacing={1.5}>
      {!readOnly ? (
        <Stack direction="row" justifyContent="flex-end">
          <Button
            label="Add service"
            size="sm"
            startIcon={<Plus size={14} />}
            onClick={() => setAddModalOpen(true)}
          />
        </Stack>
      ) : null}

      <Box sx={{ width: '100%' }}>
        <Box sx={agreementEmbeddedTableSx}>
          {rates.length === 0 ? (
            <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                No VFS services configured yet.
                {!readOnly ? ' Use Add service to define service name, rate, and GST treatment.' : ''}
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
                {rates.map((rate) => (
                  <TableRow key={rate.id} hover>
                    <TableCell sx={{ fontSize: 13 }}>{rate.serviceName}</TableCell>
                    <TableCell align="right" sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
                      {formatInr(rate.amount)}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      <Badge
                        label={formatVfsGstLabel(rate.gstIncluded ?? false)}
                        color={rate.gstIncluded ? 'success' : 'neutral'}
                        size="sm"
                      />
                    </TableCell>
                    {!readOnly ? (
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          aria-label={`Remove ${rate.serviceName}`}
                          onClick={() => removeRate(rate.id)}
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
      </Box>

      <AddVfsServiceRateModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={addRate}
      />
    </Stack>
  )
}
