import { useState } from 'react'
import { Box } from '@mui/material'
import { Tabs } from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import type { BusinessSegment, CountryMasterFormData } from '@/shared/types/countryMaster'
import {
  COUNTRY_VISA_CONFIGURATION_TABS,
  DEFAULT_COUNTRY_VISA_CONFIGURATION_TAB,
  type CountryVisaConfigurationTab,
} from '../../config/countryVisaConfigurationTabs'
import {
  VisaConfigurationDocumentsTab,
  type VisaConfigurationScope,
} from './tabs/VisaConfigurationDocumentsTab'
import { VisaConfigurationQcChecklistsTab } from './tabs/VisaConfigurationQcChecklistsTab'
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
  const [activeTab, setActiveTab] = useState<CountryVisaConfigurationTab>(
    DEFAULT_COUNTRY_VISA_CONFIGURATION_TAB,
  )

  return (
    <AdminOverlayFormSection title="Configuration" importance="secondary" columns={1}>
      <Tabs
        items={COUNTRY_VISA_CONFIGURATION_TABS.map((tab) => ({
          value: tab.value,
          label: tab.label,
        }))}
        value={activeTab}
        onChange={(value) => setActiveTab(value as CountryVisaConfigurationTab)}
        variant="underline"
        size="sm"
        fullWidth
      />
      <Box sx={{ pt: activeTab === 'qc-checklists' || activeTab === 'vfs-rates' ? 1 : 2 }}>
        {activeTab === 'documents' ? (
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
        {activeTab === 'vfs-rates' ? (
          <VisaConfigurationVfsRatesTab
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
        {activeTab === 'qc-checklists' ? (
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
      </Box>
    </AdminOverlayFormSection>
  )
}
