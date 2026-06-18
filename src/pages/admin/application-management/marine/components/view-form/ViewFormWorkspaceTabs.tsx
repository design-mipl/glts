import { useState, type ReactNode } from 'react'
import { Stack } from '@mui/material'
import { BaseCard, Tabs } from '@/design-system/UIComponents'

export type ViewFormWorkspaceTab = 'qc' | 'form'

interface ViewFormWorkspaceTabsProps {
  qcPanel: ReactNode
  formPanel: ReactNode
}

export function ViewFormWorkspaceTabs({ qcPanel, formPanel }: ViewFormWorkspaceTabsProps) {
  const [activeTab, setActiveTab] = useState<ViewFormWorkspaceTab>('qc')

  return (
    <BaseCard sx={{ overflow: 'hidden' }}>
      <Stack spacing={2} sx={{ p: 2 }}>
        <Tabs
          value={activeTab}
          onChange={value => setActiveTab(value as ViewFormWorkspaceTab)}
          variant="underline"
          size="sm"
          items={[
            { value: 'qc', label: 'QC Check' },
            { value: 'form', label: 'Form view' },
          ]}
        />
        {activeTab === 'qc' ? qcPanel : null}
        {activeTab === 'form' ? formPanel : null}
      </Stack>
    </BaseCard>
  )
}
