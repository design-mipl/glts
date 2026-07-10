import { useEffect, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  Button,
  FormField,
  Input,
  Select,
  Textarea,
  useToast,
} from '@/design-system/UIComponents'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import type {
  AirportAssistanceType,
  HandDeliveryLocation,
  LogisticsDeliveryMethod,
  LogisticsDispatchDetails,
} from '@/shared/types/logisticsDispatch'
import {
  AIRPORT_ASSISTANCE_TYPES,
  createEmptyLogisticsDispatchDetails,
  HAND_DELIVERY_LOCATIONS,
  LOGISTICS_COURIER_PARTNERS,
  LOGISTICS_DELIVERY_METHODS,
} from '@/shared/types/logisticsDispatch'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import {
  formatLogisticsDateTime,
  fromDateTimeLocalValue,
  toDateTimeLocalValue,
  validateLogisticsDispatchDetails,
} from '@/shared/utils/logisticsDispatchUtils'
import {
  formatInrCharge,
  resolveAirportAssistanceCharge,
  resolveCargoHandlingCharge,
  resolveCourierServiceCharge,
} from '@/shared/utils/logisticsDispatchChargeUtils'

function SectionHeading({ children }: { children: string }) {
  return (
    <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, color: 'text.primary' }}>
      {children}
    </Typography>
  )
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.2}>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 12 }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

interface LogisticsDispatchTabProps {
  record: OperationalCase
  onUpdated: () => void
  onDispatched?: () => void
}

export function LogisticsDispatchTab({ record, onUpdated, onDispatched }: LogisticsDispatchTabProps) {
  const { showToast } = useToast()
  const isDispatched = Boolean(record.dispatchDetails?.dispatchedAt)
  const isViewOnly = isDispatched || record.status === 'Dispatched' || record.status === 'Completed'
  const canEditDispatch = record.status === 'Collected' && !isViewOnly

  const [dispatchForm, setDispatchForm] = useState<LogisticsDispatchDetails>(
    record.dispatchDetails ?? createEmptyLogisticsDispatchDetails(),
  )

  useEffect(() => {
    setDispatchForm(record.dispatchDetails ?? createEmptyLogisticsDispatchDetails())
  }, [record.id, record.dispatchDetails])

  const deliveryMethod = dispatchForm.deliveryMethod

  const prefillChargesForMethod = (
    method: LogisticsDeliveryMethod,
  ): Partial<LogisticsDispatchDetails> => {
    switch (method) {
      case 'Courier':
        return { courierCharges: resolveCourierServiceCharge(record) ?? undefined }
      case 'Airport Assistance':
        return {
          airportAssistanceCharges: resolveAirportAssistanceCharge(record) ?? undefined,
        }
      case 'Cargo':
        return { cargoHandlingCharges: resolveCargoHandlingCharge(record) ?? undefined }
      default:
        return {}
    }
  }

  const patchDispatch = (patch: Partial<LogisticsDispatchDetails>) => {
    setDispatchForm(current => ({ ...current, ...patch }))
  }

  const handleDispatch = () => {
    const validation = validateLogisticsDispatchDetails(dispatchForm)
    if (!validation.valid) {
      showToast({
        title: 'Missing dispatch details',
        description: validation.message,
        variant: 'error',
      })
      return
    }

    const updated = operationalCaseHandlingService.dispatchPassport(record.id, {
      ...dispatchForm,
      dispatchDateTime: fromDateTimeLocalValue(dispatchForm.dispatchDateTime),
    })

    if (!updated) {
      showToast({
        title: 'Unable to dispatch',
        description: 'Ensure the case is collected before dispatch.',
        variant: 'error',
      })
      return
    }

    onUpdated()
    onDispatched?.()
    showToast({
      title: 'Passport dispatched',
      description: 'Dispatch details saved and case marked completed.',
      variant: 'success',
    })
  }

  if (record.status === 'Document Submitted') {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        Mark the case as collected from the Overview tab before entering dispatch details.
      </Typography>
    )
  }

  return (
    <Stack spacing={1.25}>
      <SectionHeading>Dispatch details</SectionHeading>

      {isViewOnly && record.dispatchDetails ? (
        <Stack spacing={1.25}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
            <ReadField label="Delivery Method" value={record.dispatchDetails.deliveryMethod} />
            <ReadField
              label="Dispatch Date & Time"
              value={formatLogisticsDateTime(record.dispatchDetails.dispatchDateTime)}
            />
          </Box>
          <ReadField label="Remarks / Description" value={record.dispatchDetails.remarks} />

          {record.dispatchDetails.deliveryMethod === 'Courier' ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
              <ReadField
                label="Courier charges"
                value={formatInrCharge(record.dispatchDetails.courierCharges)}
              />
              <ReadField label="Courier Partner" value={record.dispatchDetails.courierPartner ?? ''} />
              <ReadField label="AWB Number" value={record.dispatchDetails.awbNumber ?? ''} />
              <ReadField label="Tracking URL" value={record.dispatchDetails.trackingUrl ?? ''} />
            </Box>
          ) : null}

          {record.dispatchDetails.deliveryMethod === 'Airport Assistance' ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
              <ReadField
                label="Airport assistance charges"
                value={formatInrCharge(record.dispatchDetails.airportAssistanceCharges)}
              />
              <ReadField label="Assistance Type" value={record.dispatchDetails.assistanceType ?? ''} />
              <ReadField label="Tracking URL" value={record.dispatchDetails.trackingUrl ?? ''} />
            </Box>
          ) : null}

          {record.dispatchDetails.deliveryMethod === 'Cargo' ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
              <ReadField
                label="Cargo & Handling Charges"
                value={formatInrCharge(record.dispatchDetails.cargoHandlingCharges)}
              />
              <ReadField label="Tracking URL" value={record.dispatchDetails.trackingUrl ?? ''} />
            </Box>
          ) : null}

          {record.dispatchDetails.deliveryMethod === 'Hand Delivery' ? (
            <ReadField label="Delivery Location" value={record.dispatchDetails.deliveryLocation ?? ''} />
          ) : null}
        </Stack>
      ) : canEditDispatch ? (
        <Stack spacing={1.25}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
            <FormField label="Delivery Method" required>
              <Select
                value={deliveryMethod}
                onChange={value => {
                  const method = String(value) as LogisticsDeliveryMethod
                  patchDispatch({
                    deliveryMethod: method,
                    courierPartner: '',
                    awbNumber: '',
                    courierCharges: undefined,
                    trackingUrl: '',
                    assistanceType: undefined,
                    airportAssistanceCharges: undefined,
                    cargoHandlingCharges: undefined,
                    deliveryLocation: undefined,
                    ...prefillChargesForMethod(method),
                  })
                }}
                options={LOGISTICS_DELIVERY_METHODS.map(method => ({
                  value: method,
                  label: method,
                }))}
                placeholder="Select delivery method"
                size="sm"
                fullWidth
              />
            </FormField>

            <FormField label="Dispatch Date & Time" required>
              <Input
                type="datetime-local"
                size="sm"
                value={toDateTimeLocalValue(dispatchForm.dispatchDateTime)}
                onChange={value => patchDispatch({ dispatchDateTime: value })}
                fullWidth
              />
            </FormField>
          </Box>

          <FormField label="Remarks / Description">
            <Textarea
              rows={3}
              value={dispatchForm.remarks}
              onChange={value => patchDispatch({ remarks: value })}
              placeholder="Dispatch notes for audit trail"
            />
          </FormField>

          {deliveryMethod === 'Courier' ? (
            <Stack spacing={1.25}>
              <FormField label="Courier charges" required>
                <Input
                  type="number"
                  size="sm"
                  value={
                    dispatchForm.courierCharges != null ? String(dispatchForm.courierCharges) : ''
                  }
                  onChange={value =>
                    patchDispatch({ courierCharges: value === '' ? undefined : Number(value) || 0 })
                  }
                  placeholder="Enter amount in INR"
                  fullWidth
                />
              </FormField>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
                <FormField label="Courier Partner" required>
                  <Select
                    value={dispatchForm.courierPartner ?? ''}
                    onChange={value => patchDispatch({ courierPartner: String(value) })}
                    options={LOGISTICS_COURIER_PARTNERS.map(partner => ({
                      value: partner,
                      label: partner,
                    }))}
                    placeholder="Select courier partner"
                    size="sm"
                    fullWidth
                  />
                </FormField>
                <FormField label="AWB Number" required>
                  <Input
                    size="sm"
                    value={dispatchForm.awbNumber ?? ''}
                    onChange={value => patchDispatch({ awbNumber: value })}
                    placeholder="e.g. BD123456789IN"
                    fullWidth
                  />
                </FormField>
              </Box>
              <FormField label="Tracking URL" optional>
                <Input
                  size="sm"
                  value={dispatchForm.trackingUrl ?? ''}
                  onChange={value => patchDispatch({ trackingUrl: value })}
                  placeholder="https://"
                  fullWidth
                />
              </FormField>
            </Stack>
          ) : null}

          {deliveryMethod === 'Airport Assistance' ? (
            <Stack spacing={1.25}>
              <FormField label="Airport assistance charges" required>
                <Input
                  type="number"
                  size="sm"
                  value={
                    dispatchForm.airportAssistanceCharges != null
                      ? String(dispatchForm.airportAssistanceCharges)
                      : ''
                  }
                  onChange={value =>
                    patchDispatch({
                      airportAssistanceCharges:
                        value === '' ? undefined : Number(value) || 0,
                    })
                  }
                  placeholder="Enter amount in INR"
                  fullWidth
                />
              </FormField>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
                <FormField label="Assistance Type" required>
                  <Select
                    value={dispatchForm.assistanceType ?? ''}
                    onChange={value =>
                      patchDispatch({ assistanceType: String(value) as AirportAssistanceType })
                    }
                    options={AIRPORT_ASSISTANCE_TYPES.map(type => ({
                      value: type,
                      label: type,
                    }))}
                    placeholder="Select assistance type"
                    size="sm"
                    fullWidth
                  />
                </FormField>
                <FormField label="Tracking URL" optional>
                  <Input
                    size="sm"
                    value={dispatchForm.trackingUrl ?? ''}
                    onChange={value => patchDispatch({ trackingUrl: value })}
                    placeholder="https://"
                    fullWidth
                  />
                </FormField>
              </Box>
            </Stack>
          ) : null}

          {deliveryMethod === 'Cargo' ? (
            <Stack spacing={1.25}>
              <FormField label="Cargo & Handling Charges" required>
                <Input
                  type="number"
                  size="sm"
                  value={
                    dispatchForm.cargoHandlingCharges != null
                      ? String(dispatchForm.cargoHandlingCharges)
                      : ''
                  }
                  onChange={value =>
                    patchDispatch({
                      cargoHandlingCharges: value === '' ? undefined : Number(value) || 0,
                    })
                  }
                  placeholder="Enter amount in INR"
                  fullWidth
                />
              </FormField>
              <FormField label="Tracking URL" optional>
                <Input
                  size="sm"
                  value={dispatchForm.trackingUrl ?? ''}
                  onChange={value => patchDispatch({ trackingUrl: value })}
                  placeholder="https://"
                  fullWidth
                />
              </FormField>
            </Stack>
          ) : null}

          {deliveryMethod === 'Hand Delivery' ? (
            <FormField label="Delivery Location" required>
              <Select
                value={dispatchForm.deliveryLocation ?? ''}
                onChange={value =>
                  patchDispatch({ deliveryLocation: String(value) as HandDeliveryLocation })
                }
                options={HAND_DELIVERY_LOCATIONS.map(location => ({
                  value: location,
                  label: location,
                }))}
                placeholder="Select delivery location"
                size="sm"
                fullWidth
              />
            </FormField>
          ) : null}

          <Button label="Save & dispatch" size="sm" onClick={handleDispatch} />
        </Stack>
      ) : null}
    </Stack>
  )
}
