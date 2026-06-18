import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { ClipboardCheck, Pencil } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, ConfirmDialog, EmptyState, useToast } from '@/design-system/UIComponents'
import { AdminRecordPageChrome } from '@/pages/admin/components/AdminRecordPageChrome'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_FULL_PAGE_FORM_LAYOUT } from '@/pages/admin/components/adminFullPageFormLayout'
import { BaseCard } from '@/design-system/UIComponents'
import type { BusinessSegment } from '@/shared/types/countryMaster'
import { COUNTRY_WORKSPACE_LAYOUT, COUNTRY_WORKSPACE_TREE_SX } from '../../config/countryWorkspaceLayout'
import { useCountryConfigWorkspace } from '../../hooks/useCountryConfigWorkspace'
import { ConfigTree } from './ConfigTree'
import { WorkspacePageHeader } from './WorkspacePageHeader'
import { WorkspacePanelHeader } from './WorkspacePanelHeader'
import { shouldShowJurisdictionNodes } from '../../utils/countryConfigTreeUtils'
import { getWorkspacePanelMeta } from '../../utils/countryWorkspacePanelUtils'
import { AddJurisdictionDrawer } from './drawers/AddJurisdictionDrawer'
import { AddVisaTypeDrawer } from './drawers/AddVisaTypeDrawer'
import { CountryOverviewPanel } from './panels/CountryOverviewPanel'
import { JurisdictionPanel } from './panels/JurisdictionPanel'
import { ReviewPublishPanel } from './panels/ReviewPublishPanel'
import { SegmentPanel } from './panels/SegmentPanel'
import { VisaTypePanel } from './panels/VisaTypePanel'
import {
  CountryWorkspaceModeProvider,
  type CountryWorkspaceMode,
} from './countryWorkspaceModeContext'

interface CountryConfigWorkspaceProps {
  countryId: string
  mode: CountryWorkspaceMode
}

function parseNodeParts(node: string): {
  type: 'overview' | 'review' | 'segment' | 'visaType' | 'jurisdiction'
  segment?: BusinessSegment
  visaTypeId?: string
  jurisdictionId?: string
} {
  if (node === 'overview') return { type: 'overview' }
  if (node === 'review') return { type: 'review' }
  const parts = node.split('/')
  if (parts.length === 1) return { type: 'segment', segment: parts[0] as BusinessSegment }
  if (parts.length === 2) {
    return { type: 'visaType', segment: parts[0] as BusinessSegment, visaTypeId: parts[1] }
  }
  return {
    type: 'jurisdiction',
    segment: parts[0] as BusinessSegment,
    visaTypeId: parts[1],
    jurisdictionId: parts[2],
  }
}

export function CountryConfigWorkspace({ countryId, mode }: CountryConfigWorkspaceProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()
  const isEditMode = mode === 'edit'
  const readOnly = !isEditMode

  const {
    country,
    formData,
    loading,
    dirty,
    saving,
    activeNode,
    summary,
    selectNode,
    updateFormData,
    saveDraft,
    publish,
    deactivate,
    refreshFromService,
    discardChanges,
  } = useCountryConfigWorkspace(countryId)

  const [visaDrawerOpen, setVisaDrawerOpen] = useState(false)
  const [visaDrawerSegment, setVisaDrawerSegment] = useState<BusinessSegment | null>(null)
  const [jurDrawerOpen, setJurDrawerOpen] = useState(false)
  const [jurDrawerSegment, setJurDrawerSegment] = useState<BusinessSegment | null>(null)
  const [jurDrawerVisaTypeId, setJurDrawerVisaTypeId] = useState<string | null>(null)
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)

  const viewUrl = `/admin/masters/country/${countryId}?${searchParams.toString()}`
  const editUrl = `/admin/masters/country/${countryId}/edit?${searchParams.toString()}`

  const enterEditMode = useCallback(() => {
    navigate(editUrl)
  }, [navigate, editUrl])

  const exitToViewMode = useCallback(() => {
    navigate(viewUrl)
  }, [navigate, viewUrl])

  const handleFormChange = useCallback(
    (next: Parameters<typeof updateFormData>[0]) => {
      if (readOnly) return
      updateFormData(next)
    },
    [readOnly, updateFormData],
  )

  const nodeParts = useMemo(() => parseNodeParts(activeNode), [activeNode])
  const treeCountry = useMemo(() => {
    if (!country || !formData) return country
    return { ...country, segments: formData.segments, status: formData.status }
  }, [country, formData])
  const panelMeta = useMemo(() => {
    if (!treeCountry) return null
    return getWorkspacePanelMeta(treeCountry, activeNode, nodeParts)
  }, [treeCountry, activeNode, nodeParts])

  useEffect(() => {
    if (!treeCountry || nodeParts.type !== 'jurisdiction') return
    const { segment, visaTypeId } = nodeParts
    if (!segment || !visaTypeId) return
    const visaType = treeCountry.segments
      .find((entry) => entry.segment === segment)
      ?.visaTypes.find((entry) => entry.id === visaTypeId)
    if (visaType && !shouldShowJurisdictionNodes(visaType)) {
      selectNode(`${segment}/${visaTypeId}`)
    }
  }, [treeCountry, nodeParts, selectNode])

  const { shellPaddingX, stickyFooterZIndex } = ADMIN_FULL_PAGE_FORM_LAYOUT
  const panelPadding = { xs: 2, sm: 2.5, md: 3 }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!country || !formData) {
    return (
      <EmptyState
        variant="no-data"
        title="Country not found"
        action={{
          label: 'Back to Country Master',
          onClick: () => navigate('/admin/masters/country'),
        }}
      />
    )
  }

  const handleSaveDraft = async () => {
    await saveDraft()
    showToast({ title: 'Draft saved', variant: 'success' })
    exitToViewMode()
  }

  const handlePublish = async () => {
    await publish()
    showToast({ title: 'Country published', variant: 'success' })
    exitToViewMode()
  }

  const handleCancel = () => {
    if (isEditMode && dirty) {
      setDiscardOpen(true)
      return
    }
    if (isEditMode) {
      exitToViewMode()
      return
    }
    navigate('/admin/masters/country')
  }

  const handleConfirmDiscard = () => {
    discardChanges()
    setDiscardOpen(false)
    exitToViewMode()
  }

  const handleDeactivate = async () => {
    await deactivate()
    setDeactivateOpen(false)
    showToast({ title: 'Country deactivated', variant: 'success' })
    navigate('/admin/masters/country')
  }

  const openVisaDrawer = (segment: BusinessSegment) => {
    if (readOnly) return
    setVisaDrawerSegment(segment)
    setVisaDrawerOpen(true)
  }

  const openJurDrawer = (segment: BusinessSegment, visaTypeId: string) => {
    if (readOnly) return
    setJurDrawerSegment(segment)
    setJurDrawerVisaTypeId(visaTypeId)
    setJurDrawerOpen(true)
  }

  const renderPanel = () => {
    switch (nodeParts.type) {
      case 'overview':
        return (
          <CountryOverviewPanel
            countryId={countryId}
            formData={formData}
            onChange={handleFormChange}
            onSelectSegment={(seg) => selectNode(seg)}
          />
        )
      case 'review':
        return summary ? (
          <ReviewPublishPanel summary={summary} onWarningClick={selectNode} />
        ) : null
      case 'segment':
        return nodeParts.segment ? (
          <SegmentPanel
            segment={nodeParts.segment}
            formData={formData}
            onChange={handleFormChange}
            onAddVisaType={() => openVisaDrawer(nodeParts.segment!)}
            onSelectVisaType={(vtId) => selectNode(`${nodeParts.segment}/${vtId}`)}
          />
        ) : null
      case 'visaType':
        return nodeParts.segment && nodeParts.visaTypeId ? (
          <VisaTypePanel
            countryId={countryId}
            segment={nodeParts.segment}
            visaTypeId={nodeParts.visaTypeId}
            formData={formData}
            onChange={handleFormChange}
            onRefresh={refreshFromService}
            onAddJurisdiction={() => openJurDrawer(nodeParts.segment!, nodeParts.visaTypeId!)}
            onSelectJurisdiction={(jurId) =>
              selectNode(`${nodeParts.segment}/${nodeParts.visaTypeId}/${jurId}`)
            }
            onJurisdictionDeleted={(jurId) => {
              const jurPath = `${nodeParts.segment}/${nodeParts.visaTypeId}/${jurId}`
              if (activeNode === jurPath) {
                selectNode(`${nodeParts.segment}/${nodeParts.visaTypeId}`)
              }
            }}
          />
        ) : null
      case 'jurisdiction':
        return nodeParts.segment && nodeParts.visaTypeId && nodeParts.jurisdictionId ? (
          <JurisdictionPanel
            countryId={countryId}
            segment={nodeParts.segment}
            visaTypeId={nodeParts.visaTypeId}
            jurisdictionId={nodeParts.jurisdictionId}
            formData={formData}
            onChange={handleFormChange}
            onRefresh={refreshFromService}
          />
        ) : null
      default:
        return null
    }
  }

  return (
    <CountryWorkspaceModeProvider mode={mode}>
    <AdminRecordPageChrome
      breadcrumbs={[
        { label: 'Masters', href: '/admin/masters/country' },
        { label: 'Country Master', href: '/admin/masters/country' },
        { label: country.name },
      ]}
    >
      <BaseCard
        sx={{
          overflow: 'hidden',
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: COUNTRY_WORKSPACE_LAYOUT.workspaceBodyMinHeight,
        }}
      >
        <WorkspacePageHeader
          country={country}
          actions={
            isEditMode ? (
              <>
                <Button
                  label="Review & Publish"
                  variant="outlined"
                  startIcon={<ClipboardCheck size={14} />}
                  onClick={() => selectNode('review')}
                />
                {dirty ? (
                  <Button label="Save Draft" variant="contained" onClick={handleSaveDraft} loading={saving} />
                ) : null}
              </>
            ) : (
              <Button
                label="Edit configuration"
                variant="contained"
                startIcon={<Pencil size={14} />}
                onClick={enterEditMode}
              />
            )
          }
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: `${COUNTRY_WORKSPACE_LAYOUT.treeWidth}px minmax(0, 1fr)`,
            },
            alignItems: 'stretch',
            flex: 1,
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              ...COUNTRY_WORKSPACE_TREE_SX.column,
              borderBottomWidth: { xs: 1, lg: 0 },
              borderBottomStyle: { xs: 'solid', lg: 'none' },
            }}
          >
            <ConfigTree
              country={treeCountry ?? country}
              activeNode={activeNode}
              onSelectNode={selectNode}
              onAddVisaType={(seg) => openVisaDrawer(seg as BusinessSegment)}
              onAddJurisdiction={(seg, vtId) => openJurDrawer(seg as BusinessSegment, vtId)}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              minHeight: 0,
              height: '100%',
              bgcolor: 'background.paper',
            }}
          >
            {panelMeta ? <WorkspacePanelHeader meta={panelMeta} /> : null}
            <Box sx={{ p: panelPadding, flex: 1, minHeight: 0, overflow: 'auto' }}>{renderPanel()}</Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            zIndex: stickyFooterZIndex,
            px: shellPaddingX,
            py: 2,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <AdminFullPageFormFooter
            loading={saving}
            onCancel={handleCancel}
            cancelLabel={isEditMode ? 'Cancel' : 'Back to listing'}
            onSave={isEditMode ? (activeNode === 'review' ? handlePublish : handleSaveDraft) : enterEditMode}
            saveLabel={isEditMode ? (activeNode === 'review' ? 'Publish' : 'Save Draft') : 'Edit configuration'}
            extraActions={
              isEditMode && activeNode === 'review' ? (
                <Button
                  label="Deactivate Country"
                  variant="outlined"
                  onClick={() => setDeactivateOpen(true)}
                />
              ) : undefined
            }
          />
        </Box>
      </BaseCard>

      <AddVisaTypeDrawer
        open={visaDrawerOpen}
        countryId={countryId}
        segment={visaDrawerSegment}
        onClose={() => setVisaDrawerOpen(false)}
        onSaved={(vtId) => {
          refreshFromService()
          if (visaDrawerSegment) selectNode(`${visaDrawerSegment}/${vtId}`)
        }}
      />

      <AddJurisdictionDrawer
        open={jurDrawerOpen}
        countryId={countryId}
        segment={jurDrawerSegment}
        visaTypeId={jurDrawerVisaTypeId}
        onClose={() => setJurDrawerOpen(false)}
        onSaved={(jurId) => {
          refreshFromService()
          if (jurDrawerSegment && jurDrawerVisaTypeId) {
            selectNode(`${jurDrawerSegment}/${jurDrawerVisaTypeId}/${jurId}`)
          }
        }}
      />

      <ConfirmDialog
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        title="Deactivate country?"
        description="This country will be archived and hidden from operational workflows."
        confirmLabel="Deactivate"
        onConfirm={handleDeactivate}
        variant="destructive"
      />

      <ConfirmDialog
        open={discardOpen}
        onClose={() => setDiscardOpen(false)}
        title="Discard unsaved changes?"
        description="Your edits will be lost and the country will return to view mode."
        confirmLabel="Discard changes"
        onConfirm={handleConfirmDiscard}
        variant="destructive"
      />
    </AdminRecordPageChrome>
    </CountryWorkspaceModeProvider>
  )
}
