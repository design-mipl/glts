import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { FileText, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, ConfirmDialog, useToast } from '@/design-system/UIComponents'
import { applyFlow, applyFont, applyRadius } from '@/pages/website/theme/applyFlowTheme'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import { navigateToContinueRetailApplication } from '@/pages/customer/features/applications/utils/createApplicationNavigation'
import { deleteRetailWebsiteApplicationDraft } from '@/shared/services/retailWebsiteApplicationService'
import { removeCustomerDraftListingRow } from '@/shared/services/applicationListingDraftStorage'
import { SUBMITTED_OPERATIONAL_STATUSES } from '@/pages/customer/features/applications/types/applicationListing.types'
import type { SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import { RetailApplicationCard } from './RetailApplicationCard'

type AppsTab = 'ongoing' | 'purchased'

export function RetailApplicationsPanel() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [tab, setTab] = useState<AppsTab>('ongoing')
  const [version, setVersion] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<SingleApplicationRow | null>(null)

  const singles = useMemo(() => {
    void version
    return customerPortalService.getSingleApplications()
  }, [version])

  const ongoing = useMemo(
    () => singles.filter(r => r.operationalStatus === 'Draft'),
    [singles],
  )
  const purchased = useMemo(
    () => singles.filter(r => SUBMITTED_OPERATIONAL_STATUSES.includes(r.operationalStatus)),
    [singles],
  )

  const rows = tab === 'ongoing' ? ongoing : purchased

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    const ok =
      deleteRetailWebsiteApplicationDraft(deleteTarget.id) ||
      removeCustomerDraftListingRow(deleteTarget.id)
    setDeleteTarget(null)
    if (ok) {
      setVersion(v => v + 1)
      showToast({ title: 'Application deleted', variant: 'success' })
    } else {
      showToast({ title: 'Could not delete', variant: 'error' })
    }
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Typography sx={{ fontFamily: applyFont.body, fontWeight: 800, fontSize: 22, color: applyFlow.ink }}>
          Applications
        </Typography>
        <Button
          variant="contained"
          size="sm"
          startIcon={<Plus size={14} />}
          onClick={() => navigate('/countries')}
        >
          Start application
        </Button>
      </Stack>

      <Stack direction="row" spacing={0.75} sx={{ mb: 2.5 }}>
        <TabChip
          active={tab === 'ongoing'}
          label={`Ongoing${ongoing.length ? ` · ${ongoing.length}` : ''}`}
          onClick={() => setTab('ongoing')}
        />
        <TabChip
          active={tab === 'purchased'}
          label={`Purchased${purchased.length ? ` · ${purchased.length}` : ''}`}
          onClick={() => setTab('purchased')}
        />
      </Stack>

      {rows.length === 0 ? (
        <Box
          sx={{
            py: 6,
            px: 3,
            textAlign: 'center',
            borderRadius: applyRadius.card,
            bgcolor: applyFlow.surface,
            border: `1px solid ${applyFlow.hairline}`,
          }}
        >
          <FileText size={32} color={applyFlow.inkFaint} />
          <Typography sx={{ mt: 1.5, fontWeight: 800, fontSize: 16, color: applyFlow.ink }}>
            {tab === 'ongoing' ? 'No ongoing applications' : 'No purchased applications'}
          </Typography>
          <Typography sx={{ mt: 0.75, fontSize: 13.5, color: applyFlow.inkMuted, maxWidth: 360, mx: 'auto' }}>
            {tab === 'ongoing'
              ? 'Start a visa application and pick up exactly where you left off.'
              : 'Applications appear here after payment while we process your visa.'}
          </Typography>
          {tab === 'ongoing' ? (
            <Button variant="contained" sx={{ mt: 2.5 }} onClick={() => navigate('/countries')}>
              Browse destinations
            </Button>
          ) : null}
        </Box>
      ) : (
        <Stack spacing={1.75}>
          {rows.map(row => (
            <RetailApplicationCard
              key={row.id}
              row={row}
              mode={tab}
              onView={() => navigate(`/retail/applications/${row.id}`)}
              onContinue={
                tab === 'ongoing'
                  ? () => navigateToContinueRetailApplication(navigate, row, '/retail')
                  : undefined
              }
              onDelete={tab === 'ongoing' ? () => setDeleteTarget(row) : undefined}
            />
          ))}
        </Stack>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete ongoing application?"
        description={
          deleteTarget
            ? `Remove ${deleteTarget.visaType} for ${deleteTarget.applicantName}? This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        variant="destructive"
      />
    </Box>
  )
}

function TabChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        appearance: 'none',
        border: `1px solid ${active ? applyFlow.accentBorder : applyFlow.hairline}`,
        bgcolor: active ? applyFlow.accentSoft : applyFlow.surface,
        color: active ? applyFlow.accentInk : applyFlow.inkMuted,
        fontWeight: active ? 800 : 600,
        fontSize: 13,
        fontFamily: applyFont.body,
        px: 2,
        py: 1,
        borderRadius: '999px',
        cursor: 'pointer',
        transition: 'all 140ms ease',
        '&:hover': {
          borderColor: applyFlow.accentBorder,
          color: applyFlow.accentInk,
        },
      }}
    >
      {label}
    </Box>
  )
}
