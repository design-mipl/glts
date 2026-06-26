import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
import { FormField, Select } from '@/design-system/UIComponents'
import { taxMasterService } from '@/shared/services/taxMasterService'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import {
  AGREEMENT_TAX_APPLICABLE_OPTIONS,
  resolveAgreementGstRateId,
  resolveAgreementTdsSectionId,
  syncAgreementGstFromRateId,
  syncAgreementTdsFromSectionId,
} from '../../utils/agreementTaxUtils'
import { agreementFieldError } from '../agreementFormLayout'

interface AgreementTaxConfigSectionProps {
  data: CommercialAgreementFormData
  errors: Record<string, string>
  onChange: (next: CommercialAgreementFormData) => void
  readOnly?: boolean
}

export function AgreementTaxConfigSection({
  data,
  errors,
  onChange,
  readOnly = false,
}: AgreementTaxConfigSectionProps) {
  const { billingConfig } = data
  const gstOptions = useMemo(() => taxMasterService.listActiveGstOptions(), [])
  const tdsOptions = useMemo(() => taxMasterService.listActiveTdsOptions(), [])

  const gstRateId = resolveAgreementGstRateId(billingConfig)
  const tdsSectionId = resolveAgreementTdsSectionId(billingConfig)

  const updateBilling = (patch: Partial<CommercialAgreementFormData['billingConfig']>) => {
    onChange({ ...data, billingConfig: { ...billingConfig, ...patch } })
  }

  if (readOnly) {
    return (
      <Box
        sx={{
          pl: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 2,
        }}
      >
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          GST applicable: {billingConfig.gstApplicable ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          GST rate:{' '}
          {billingConfig.gstApplicable
            ? taxMasterService.getGstLabel(gstRateId) || `${billingConfig.gstPercentage}%`
            : '—'}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          TDS applicable: {billingConfig.tdsApplicable ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          TDS section:{' '}
          {billingConfig.tdsApplicable
            ? taxMasterService.getTdsLabel(tdsSectionId) || `${billingConfig.tdsPercentage}%`
            : '—'}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        pl: 2,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 2,
      }}
    >
      <FormField label="GST applicable" required>
        <Select
          value={billingConfig.gstApplicable ? 'yes' : 'no'}
          onChange={(v) => {
            const applicable = String(v) === 'yes'
            if (!applicable) {
              updateBilling({ gstApplicable: false, gstPercentage: 0 })
              return
            }
            const defaultRateId = gstRateId || String(gstOptions[0]?.value ?? '')
            updateBilling(syncAgreementGstFromRateId(defaultRateId))
          }}
          options={[...AGREEMENT_TAX_APPLICABLE_OPTIONS]}
          placeholder="Select option"
          fullWidth
        />
      </FormField>

      <FormField label="GST rate" required {...agreementFieldError(errors, 'gstPercentage')}>
        <Select
          value={gstRateId}
          onChange={(v) => updateBilling(syncAgreementGstFromRateId(String(v)))}
          options={gstOptions}
          placeholder="Select GST rate"
          fullWidth
          disabled={!billingConfig.gstApplicable}
        />
      </FormField>

      <FormField label="TDS applicable" required>
        <Select
          value={billingConfig.tdsApplicable ? 'yes' : 'no'}
          onChange={(v) => {
            const applicable = String(v) === 'yes'
            if (!applicable) {
              updateBilling({ tdsApplicable: false, tdsPercentage: 0 })
              return
            }
            const defaultSectionId = tdsSectionId || String(tdsOptions[0]?.value ?? '')
            updateBilling(syncAgreementTdsFromSectionId(defaultSectionId))
          }}
          options={[...AGREEMENT_TAX_APPLICABLE_OPTIONS]}
          placeholder="Select option"
          fullWidth
        />
      </FormField>

      <FormField label="TDS section" {...agreementFieldError(errors, 'tdsPercentage')}>
        <Select
          value={tdsSectionId}
          onChange={(v) => updateBilling(syncAgreementTdsFromSectionId(String(v)))}
          options={tdsOptions}
          placeholder="Select TDS section"
          fullWidth
          disabled={!billingConfig.tdsApplicable}
        />
      </FormField>
    </Box>
  )
}
