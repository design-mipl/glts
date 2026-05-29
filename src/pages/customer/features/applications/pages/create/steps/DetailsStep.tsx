import { useMemo } from 'react'
import { Box, Card, Chip, Grid, Stack, Typography } from '@mui/material'
import { FormField, Input, Select } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getVisaOfferingById } from '@/shared/services/countryMasterService'
import { entityMasterService } from '@/shared/services/entityMasterService'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import { vesselTypeLabel } from '@/pages/customer/features/masters/vessels/config/vesselTypeConfig'
import type { ApplicationFlowState } from '../../../hooks/useApplicationFlowState'
import { FlowStepActions } from '../../../components/create/FlowStepActions'

interface DetailsStepProps {
  state: ApplicationFlowState
  onUpdate: (patch: Partial<ApplicationFlowState>) => void
  onContinue: () => void
}

export function DetailsStep({ state, onUpdate, onContinue }: DetailsStepProps) {
  const colors = usePublicBrandColors()

  const offering = useMemo(
    () => getVisaOfferingById(state.countryId, state.visaOfferingId),
    [state.countryId, state.visaOfferingId],
  )

  const isMarine = offering?.segment === 'marine' || offering?.workflowProfile === 'crew'
  const isCorporate = offering?.segment === 'corporate'

  const activeEntities = useMemo(
    () => entityMasterService.list({ status: 'active' }),
    [],
  )
  const activeVessels = useMemo(
    () => vesselMasterService.list({ status: 'active' }),
    [],
  )

  const handleEntitySelect = (entityId: string) => {
    if (!entityId) {
      onUpdate({
        entityId: '',
        entityName: '',
        contactPerson: '',
        location: '',
        billingAddress: '',
      })
      return
    }
    const entity = entityMasterService.getById(entityId)
    if (!entity) return
    const locationText = [entity.location, entity.city, entity.country].filter(Boolean).join(', ')
    onUpdate({
      entityId: entity.id,
      entityName: entity.entityName,
      contactPerson: entity.contactPersonName,
      location: locationText,
      billingAddress: locationText,
    })
  }

  const handleVesselSelect = (vesselId: string) => {
    if (!vesselId) {
      onUpdate({
        vesselId: '',
        vesselName: '',
        imoNumber: '',
        vesselType: '',
        flagCountry: '',
        portOfRegistry: '',
        joiningPort: '',
      })
      return
    }
    const vessel = vesselMasterService.getById(vesselId)
    if (!vessel) return
    onUpdate({
      vesselId: vessel.id,
      vesselName: vessel.vesselName,
      imoNumber: vessel.imoNumber,
      vesselType: vessel.vesselType,
      flagCountry: vessel.flagCountry,
      portOfRegistry: vessel.portOfRegistry,
      joiningPort: vessel.portOfRegistry,
    })
  }

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', width: '100%' }}>
      <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 22 }, color: colors.navy, mb: 0.5 }}>
        Additional details
      </Typography>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 2 }}>
        {isMarine
          ? 'Select a vessel from your master list to auto-fill marine application details.'
          : isCorporate
            ? 'Select an entity from your master list to auto-fill corporate billing details.'
            : 'Add billing and vessel details before final submission.'}
      </Typography>

      <Card
        sx={{
          p: { xs: 1.5, md: 2 },
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          bgcolor: colors.surface,
        }}
      >
        <Grid container spacing={1.25}>
          {isCorporate && (
            <>
              <Grid size={{ xs: 12 }}>
                <FormField label="Entity">
                  <Select
                    value={state.entityId}
                    onChange={v => handleEntitySelect(String(v))}
                    options={[
                      { value: '', label: 'Select entity' },
                      ...activeEntities.map(e => ({ value: e.id, label: e.entityName })),
                    ]}
                  />
                </FormField>
              </Grid>
              {state.entityId && (
                <Grid size={{ xs: 12 }}>
                  <Stack direction="row" flexWrap="wrap" gap={0.75}>
                    <Chip label={state.entityName} size="small" />
                    <Chip label={state.contactPerson} size="small" variant="outlined" />
                    <Chip label={state.location} size="small" variant="outlined" />
                  </Stack>
                </Grid>
              )}
            </>
          )}

          {isMarine && (
            <>
              <Grid size={{ xs: 12 }}>
                <FormField label="Vessel">
                  <Select
                    value={state.vesselId}
                    onChange={v => handleVesselSelect(String(v))}
                    options={[
                      { value: '', label: 'Select vessel' },
                      ...activeVessels.map(v => ({
                        value: v.id,
                        label: `${v.vesselName} (IMO ${v.imoNumber})`,
                      })),
                    ]}
                  />
                </FormField>
              </Grid>
              {state.vesselId && (
                <Grid size={{ xs: 12 }}>
                  <Stack direction="row" flexWrap="wrap" gap={0.75}>
                    <Chip label={state.vesselName} size="small" />
                    <Chip label={`IMO ${state.imoNumber}`} size="small" variant="outlined" />
                    {state.vesselType && (
                      <Chip
                        label={vesselTypeLabel[state.vesselType as keyof typeof vesselTypeLabel] ?? state.vesselType}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    <Chip label={state.flagCountry} size="small" variant="outlined" />
                    {state.portOfRegistry && (
                      <Chip label={`Port: ${state.portOfRegistry}`} size="small" variant="outlined" />
                    )}
                  </Stack>
                </Grid>
              )}
            </>
          )}

          {!isCorporate && !isMarine && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField label="Reference PO" optional>
                  <Input
                    fullWidth
                    size="sm"
                    placeholder="Enter reference PO number"
                    value={state.referencePo}
                    onChange={value => onUpdate({ referencePo: value })}
                  />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormField label="Billing address" optional>
                  <Input
                    fullWidth
                    size="sm"
                    placeholder="Enter billing address"
                    value={state.billingAddress}
                    onChange={value => onUpdate({ billingAddress: value })}
                  />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField label="Vessel name" optional>
                  <Input
                    fullWidth
                    size="sm"
                    placeholder="Enter vessel name"
                    value={state.vesselName}
                    onChange={value => onUpdate({ vesselName: value })}
                  />
                </FormField>
              </Grid>
            </>
          )}
        </Grid>
      </Card>

      <FlowStepActions onContinue={onContinue} continueLabel="Continue to submit" />
    </Box>
  )
}
