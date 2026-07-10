import { useMemo, useState, type ReactNode } from 'react'
import { Stack, Typography } from '@mui/material'
import { BaseCard, Tabs } from '@/design-system/UIComponents'
import { FORM_VIEW_QC_LOCKED_MESSAGE } from '../../utils/marineDocsQcCheckUtils'

export type ViewFormWorkspaceTab = 'qc' | 'form'

interface ViewFormWorkspaceTabsProps {
  qcPanel: ReactNode
  formPanel: ReactNode
  formViewEnabled: boolean
  formViewLockedMessage?: string
}

export function ViewFormWorkspaceTabs({
  qcPanel,
  formPanel,
  formViewEnabled,
  formViewLockedMessage = FORM_VIEW_QC_LOCKED_MESSAGE,
}: ViewFormWorkspaceTabsProps) {
  const [activeTab, setActiveTab] = useState<ViewFormWorkspaceTab>('qc')

  const tabItems = useMemo(
    () => [
      { value: 'qc', label: 'QC Check' },
      { value: 'form', label: 'Form view' },
    ],
    [],
  )

  const handleTabChange = (value: string) => {
    setActiveTab(value as ViewFormWorkspaceTab)
  }

  return (
    <BaseCard sx={{ overflow: 'hidden' }}>
      <Stack spacing={2} sx={{ p: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="underline"
          size="sm"
          items={tabItems}
        />
        {!formViewEnabled ? (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.45 }}>
            {formViewLockedMessage}
          </Typography>
        ) : null}
        {activeTab === 'qc' ? qcPanel : null}
        {activeTab === 'form' ? formPanel : null}
      </Stack>
    </BaseCard>
  )
}
