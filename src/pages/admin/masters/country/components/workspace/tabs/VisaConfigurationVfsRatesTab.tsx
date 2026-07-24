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
import { PencilLine, Trash2 } from 'lucide-react'
import { Badge, Select } from '@/design-system/UIComponents'
import { AddVfsServiceRateModal } from '@/pages/admin/components/AddVfsServiceRateModal'
import type { VfsServiceRateFormValues } from '@/pages/admin/components/AddVfsServiceRateModal'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import { generateVfsServiceRateId } from '@/shared/data/countryJurisdictionDefaults'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import { vendorService } from '@/shared/services/vendorService'
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
  /** Controlled from Configuration tab row "Add service" action. */
  addModalOpen: boolean
  onAddModalOpenChange: (open: boolean) => void
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
  addModalOpen,
  onAddModalOpenChange,
}: VisaConfigurationVfsRatesTabProps) {
  const [editRate, setEditRate] = useState<CountryVfsServiceRate | null>(null)

  const vendorOptions = useMemo(
    () =>
      vendorService.list({ category: 'visa_processing', status: 'active' }).map(vendor => ({
        value: vendor.id,
        label: vendor.vendorName,
      })),
    [],
  )

  const segConfig = formData.segments.find(s => s.segment === segment)
  const visaType = segConfig?.visaTypes.find(v => v.id === visaTypeId)
  const jurisdiction =
    scope === 'jurisdiction' && jurisdictionId
      ? visaType?.jurisdictions?.find(j => j.id === jurisdictionId)
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
    persistRates(rates.filter(rate => rate.id !== rateId))
  }

  const updateVendor = (rateId: string, vendorId: string) => {
    const vendorName = vendorOptions.find(option => option.value === vendorId)?.label ?? ''
    persistRates(
      rates.map(rate =>
        rate.id === rateId
          ? {
              ...rate,
              vendorId: vendorId || undefined,
              vendorName: vendorName || undefined,
            }
          : rate,
      ),
    )
  }

  const addRate = (values: VfsServiceRateFormValues) => {
    persistRates([
      ...rates,
      {
        id: generateVfsServiceRateId(),
        serviceName: values.serviceName,
        amount: values.amount,
        gstIncluded: values.gstIncluded,
        vendorId: values.vendorId,
        vendorName: values.vendorName,
        sortOrder: rates.length,
      },
    ])
    onAddModalOpenChange(false)
  }

  const saveEditedRate = (values: VfsServiceRateFormValues) => {
    if (!editRate) return
    persistRates(
      rates.map(rate =>
        rate.id === editRate.id
          ? {
              ...rate,
              serviceName: values.serviceName,
              amount: values.amount,
              gstIncluded: values.gstIncluded,
              vendorId: values.vendorId,
              vendorName: values.vendorName,
            }
          : rate,
      ),
    )
    setEditRate(null)
    onAddModalOpenChange(false)
  }

  return (
    <Stack spacing={1.5}>
      <Box sx={{ width: '100%' }}>
        <Box sx={agreementEmbeddedTableSx}>
          {rates.length === 0 ? (
            <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                No consulate services configured yet.
                {!readOnly
                  ? ' Use Add service to define service name, rate, GST, and vendor.'
                  : ''}
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
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Vendor</TableCell>
                  {!readOnly ? (
                    <TableCell align="right" sx={{ ...agreementEmbeddedTableHeadCellSx, width: 88 }}>
                      Actions
                    </TableCell>
                  ) : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {rates.map(rate => (
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
                    <TableCell sx={{ fontSize: 13, minWidth: 200 }}>
                      {readOnly ? (
                        rate.vendorName || '—'
                      ) : (
                        <Select
                          value={rate.vendorId ?? ''}
                          onChange={value => updateVendor(rate.id, String(value))}
                          options={vendorOptions}
                          placeholder="Select vendor"
                          fullWidth
                          size="sm"
                        />
                      )}
                    </TableCell>
                    {!readOnly ? (
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                          <IconButton
                            size="small"
                            aria-label={`Edit ${rate.serviceName}`}
                            onClick={() => {
                              setEditRate(rate)
                              onAddModalOpenChange(true)
                            }}
                          >
                            <PencilLine size={14} />
                          </IconButton>
                          <IconButton
                            size="small"
                            aria-label={`Remove ${rate.serviceName}`}
                            onClick={() => removeRate(rate.id)}
                          >
                            <Trash2 size={14} />
                          </IconButton>
                        </Stack>
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
        editRate={editRate ?? undefined}
        onClose={() => {
          onAddModalOpenChange(false)
          setEditRate(null)
        }}
        onSubmit={editRate ? saveEditedRate : addRate}
      />
    </Stack>
  )
}
