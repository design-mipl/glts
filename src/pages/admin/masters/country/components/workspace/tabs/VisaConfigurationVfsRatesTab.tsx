import { useEffect, useMemo, useState } from 'react'
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
import { Badge, Checkbox, Input, Select } from '@/design-system/UIComponents'
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
import {
  URGENT_CHARGE_SERVICE_NAME,
  computeVfsIw,
  formatVfsGstLabel,
  splitVfsServiceRates,
} from '@/shared/utils/countryVfsServiceRateUtils'
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
  const [urgentCostInput, setUrgentCostInput] = useState('')
  const [urgentRateInput, setUrgentRateInput] = useState('')

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

  const { standardRates, urgentRate } = useMemo(() => splitVfsServiceRates(rates), [rates])

  useEffect(() => {
    if (!urgentRate) {
      setUrgentCostInput('')
      setUrgentRateInput('')
      return
    }
    setUrgentCostInput(urgentRate.cost != null ? String(urgentRate.cost) : '')
    setUrgentRateInput(String(urgentRate.amount ?? 0))
  }, [urgentRate])

  if (!visaType) return null
  if (scope === 'jurisdiction' && !jurisdiction) return null

  const persistRates = (
    nextStandard: CountryVfsServiceRate[],
    nextUrgent: CountryVfsServiceRate | null | undefined = urgentRate,
  ) => {
    const combined: CountryVfsServiceRate[] = [
      ...nextStandard.map((rate, index) => ({
        ...rate,
        isUrgentCharge: false,
        sortOrder: index,
      })),
    ]
    if (nextUrgent) {
      combined.push({
        ...nextUrgent,
        serviceName: URGENT_CHARGE_SERVICE_NAME,
        isUrgentCharge: true,
        sortOrder: combined.length,
      })
    }
    countryMasterAdminService.saveVfsServiceRates(
      countryId,
      segment,
      visaTypeId,
      combined,
      scope === 'jurisdiction' ? jurisdictionId : undefined,
    )
    onRefresh()
  }

  const removeRate = (rateId: string) => {
    persistRates(standardRates.filter(rate => rate.id !== rateId), urgentRate)
  }

  const updateVendor = (rateId: string, vendorId: string) => {
    const vendorName = vendorOptions.find(option => option.value === vendorId)?.label ?? ''
    persistRates(
      standardRates.map(rate =>
        rate.id === rateId
          ? {
              ...rate,
              vendorId: vendorId || undefined,
              vendorName: vendorName || undefined,
            }
          : rate,
      ),
      urgentRate,
    )
  }

  const addRate = (values: VfsServiceRateFormValues) => {
    persistRates(
      [
        ...standardRates,
        {
          id: generateVfsServiceRateId(),
          serviceName: values.serviceName,
          amount: values.amount,
          gstIncluded: values.gstIncluded,
          vendorId: values.vendorId,
          vendorName: values.vendorName,
          sortOrder: standardRates.length,
        },
      ],
      urgentRate,
    )
    onAddModalOpenChange(false)
  }

  const saveEditedRate = (values: VfsServiceRateFormValues) => {
    if (!editRate) return
    persistRates(
      standardRates.map(rate =>
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
      urgentRate,
    )
    setEditRate(null)
    onAddModalOpenChange(false)
  }

  const toggleUrgentCharge = (enabled: boolean) => {
    if (enabled) {
      if (urgentRate) return
      const defaultVendor = vendorOptions[0]
      persistRates(standardRates, {
        id: generateVfsServiceRateId(),
        serviceName: URGENT_CHARGE_SERVICE_NAME,
        amount: 0,
        cost: 0,
        gstIncluded: false,
        isUrgentCharge: true,
        vendorId: defaultVendor?.value,
        vendorName: defaultVendor?.label,
        sortOrder: standardRates.length,
      })
      return
    }
    persistRates(standardRates, null)
  }

  const commitUrgentAmounts = () => {
    if (!urgentRate) return
    const parsedCost = Number(urgentCostInput)
    const parsedRate = Number(urgentRateInput)
    const cost = urgentCostInput.trim() === '' || Number.isNaN(parsedCost) ? 0 : parsedCost
    const amount = urgentRateInput.trim() === '' || Number.isNaN(parsedRate) ? 0 : parsedRate
    if (cost === (urgentRate.cost ?? 0) && amount === urgentRate.amount) return
    persistRates(standardRates, { ...urgentRate, cost, amount })
  }

  const updateUrgentVendor = (vendorId: string) => {
    if (!urgentRate) return
    const vendorName = vendorOptions.find(option => option.value === vendorId)?.label ?? ''
    persistRates(standardRates, {
      ...urgentRate,
      vendorId: vendorId || undefined,
      vendorName: vendorName || undefined,
    })
  }

  const urgentIw = urgentRate
    ? computeVfsIw(
        Number(urgentRateInput) || urgentRate.amount,
        urgentCostInput.trim() === '' ? urgentRate.cost : Number(urgentCostInput),
      )
    : 0

  return (
    <Stack spacing={1.5}>
      <Box sx={{ width: '100%' }}>
        <Box sx={agreementEmbeddedTableSx}>
          {standardRates.length === 0 ? (
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
                {standardRates.map(rate => (
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

      <Checkbox
        label="Add urgent charge"
        checked={Boolean(urgentRate)}
        disabled={readOnly}
        size="sm"
        onChange={toggleUrgentCharge}
      />

      {urgentRate ? (
        <Box sx={{ width: '100%' }}>
          <Box sx={agreementEmbeddedTableSx}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service name</TableCell>
                  <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                    Cost
                  </TableCell>
                  <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                    Rate
                  </TableCell>
                  <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                    IW
                  </TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Vendor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell sx={{ fontSize: 13 }}>{URGENT_CHARGE_SERVICE_NAME}</TableCell>
                  <TableCell align="right" sx={{ fontSize: 13, minWidth: 120 }}>
                    {readOnly ? (
                      formatInr(urgentRate.cost ?? 0)
                    ) : (
                      <Input
                        type="number"
                        value={urgentCostInput}
                        onChange={setUrgentCostInput}
                        onBlur={commitUrgentAmounts}
                        size="sm"
                        fullWidth
                        placeholder="0"
                      />
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: 13, minWidth: 120 }}>
                    {readOnly ? (
                      formatInr(urgentRate.amount)
                    ) : (
                      <Input
                        type="number"
                        value={urgentRateInput}
                        onChange={setUrgentRateInput}
                        onBlur={commitUrgentAmounts}
                        size="sm"
                        fullWidth
                        placeholder="0"
                      />
                    )}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
                  >
                    {formatInr(urgentIw)}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, minWidth: 200 }}>
                    {readOnly ? (
                      urgentRate.vendorName || '—'
                    ) : (
                      <Select
                        value={urgentRate.vendorId ?? ''}
                        onChange={value => updateUrgentVendor(String(value))}
                        options={vendorOptions}
                        placeholder="Select vendor"
                        fullWidth
                        size="sm"
                      />
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>
      ) : null}

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
