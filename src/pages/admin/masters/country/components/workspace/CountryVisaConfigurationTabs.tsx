import { useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Plus } from 'lucide-react'
import { Button, Tabs } from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import type { BusinessSegment, CountryMasterFormData } from '@/shared/types/countryMaster'
import {
  DEFAULT_COUNTRY_VISA_CONFIGURATION_TAB,
  getCountryVisaConfigurationTabs,
  type CountryVisaConfigurationTab,
} from '../../config/countryVisaConfigurationTabs'
import {
  VisaConfigurationDocumentsTab,
  type VisaConfigurationScope,
} from './tabs/VisaConfigurationDocumentsTab'
import { VisaConfigurationQcChecklistsTab } from './tabs/VisaConfigurationQcChecklistsTab'
import { VisaConfigurationRequirementPackTab } from './tabs/VisaConfigurationRequirementPackTab'
import { VisaConfigurationVfsRatesTab } from './tabs/VisaConfigurationVfsRatesTab'

interface CountryVisaConfigurationTabsProps {
  scope: VisaConfigurationScope
  countryId: string
  segment: BusinessSegment
  visaTypeId: string
  jurisdictionId?: string
  formData: CountryMasterFormData
  onChange: (next: CountryMasterFormData) => void
  onRefresh: () => void
  readOnly: boolean
}

export function CountryVisaConfigurationTabs({
  scope,
  countryId,
  segment,
  visaTypeId,
  jurisdictionId,
  formData,
  onChange,
  onRefresh,
  readOnly,
}: CountryVisaConfigurationTabsProps) {
  // Retail: pack maps on visa type when jurisdictions are off; on jurisdiction when on.
  const includeRequirementPack = segment === 'retail'

  const tabs = useMemo(
    () =>
      getCountryVisaConfigurationTabs({
        includeOperationalTabs: true,
        includeRequirementPack,
      }),
    [includeRequirementPack],
  )

  const [activeTab, setActiveTab] = useState<CountryVisaConfigurationTab>(() => {
    return tabs[0]?.value ?? DEFAULT_COUNTRY_VISA_CONFIGURATION_TAB
  })
  const [addConsulateServiceOpen, setAddConsulateServiceOpen] = useState(false)

  const resolvedTab = tabs.some((tab) => tab.value === activeTab)
    ? activeTab
    : (tabs[0]?.value ?? DEFAULT_COUNTRY_VISA_CONFIGURATION_TAB)

  if (tabs.length === 0) return null

  const handleTabChange = (value: string) => {
    const next = value as CountryVisaConfigurationTab
    setActiveTab(next)
    if (next !== 'vfs-rates') {
      setAddConsulateServiceOpen(false)
    }
  }

  return (
    <AdminOverlayFormSection title="Configuration" importance="secondary" columns={1}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          minHeight: 40,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Tabs
            items={tabs.map((tab) => ({
              value: tab.value,
              label: tab.label,
            }))}
            value={resolvedTab}
            onChange={handleTabChange}
            variant="underline"
            size="sm"
            fullWidth
            sx={{ borderBottom: 'none' }}
          />
        </Box>
        {resolvedTab === 'vfs-rates' && !readOnly ? (
          <Button
            label="Add service"
            size="sm"
            startIcon={<Plus size={14} />}
            onClick={() => setAddConsulateServiceOpen(true)}
          />
        ) : null}
      </Stack>
      <Box
        sx={{
          pt:
            resolvedTab === 'qc-checklists' ||
            resolvedTab === 'vfs-rates' ||
            resolvedTab === 'requirement-pack'
              ? 1
              : 2,
        }}
      >
        {resolvedTab === 'documents' ? (
          <VisaConfigurationDocumentsTab
            scope={scope}
            countryId={countryId}
            segment={segment}
            visaTypeId={visaTypeId}
            jurisdictionId={jurisdictionId}
            formData={formData}
            onChange={onChange}
            onRefresh={onRefresh}
            readOnly={readOnly}
          />
        ) : null}
        {resolvedTab === 'vfs-rates' ? (
          <VisaConfigurationVfsRatesTab
            scope={scope}
            countryId={countryId}
            segment={segment}
            visaTypeId={visaTypeId}
            jurisdictionId={jurisdictionId}
            formData={formData}
            onRefresh={onRefresh}
            readOnly={readOnly}
            addModalOpen={addConsulateServiceOpen}
            onAddModalOpenChange={setAddConsulateServiceOpen}
          />
        ) : null}
        {resolvedTab === 'qc-checklists' ? (
          <VisaConfigurationQcChecklistsTab
            scope={scope}
            countryId={countryId}
            segment={segment}
            visaTypeId={visaTypeId}
            jurisdictionId={jurisdictionId}
            formData={formData}
            onRefresh={onRefresh}
            readOnly={readOnly}
          />
        ) : null}
        {resolvedTab === 'requirement-pack' ? (
          <VisaConfigurationRequirementPackTab
            scope={scope}
            segment={segment}
            visaTypeId={visaTypeId}
            jurisdictionId={jurisdictionId}
            formData={formData}
            onChange={onChange}
            readOnly={readOnly}
          />
        ) : null}
      </Box>
    </AdminOverlayFormSection>
  )
}
