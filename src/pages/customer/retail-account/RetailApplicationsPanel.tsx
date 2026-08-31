import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { FileText, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog, useToast } from '@/design-system/UIComponents'
import { AccentButton } from './retailAccountButtons'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  eyebrowSx,
  focusRingSx,
} from '@/pages/website/theme/applyFlowTheme'
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
    /* One panel, matching My Documents — header, tabs and list share a single surface
       instead of floating cards on the canvas. */
    <Box
      sx={{
        p: { xs: 2.5, lg: 3 },
        borderRadius: applyRadius.card,
        bgcolor: applyFlow.surface,
        border: `1px solid ${applyFlow.hairline}`,
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', lg: 'flex-start' }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography sx={{ ...eyebrowSx, mb: 0.75 }}>Your visas</Typography>
          <Typography
            sx={{
              fontFamily: applyFont.display,
              fontWeight: 700,
              fontSize: 22,
              color: applyFlow.ink,
              letterSpacing: '-0.01em',
            }}
          >
            Applications
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13.5, color: applyFlow.inkMuted, maxWidth: 520 }}>
            Pick up an application where you left off, or track one we're processing.
          </Typography>
        </Box>
        <AccentButton startIcon={<Plus size={15} />} onClick={() => navigate('/countries')}>
          Start application
        </AccentButton>
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
            py: 5,
            px: 3,
            textAlign: 'center',
            borderRadius: applyRadius.control,
            bgcolor: applyFlow.canvas,
            border: `1px dashed ${applyFlow.hairlineStrong}`,
          }}
        >
          <FileText size={26} color={applyFlow.inkFaint} />
          <Typography sx={{ mt: 1.25, fontWeight: 700, fontSize: 15, color: applyFlow.ink }}>
            {tab === 'ongoing' ? 'No ongoing applications' : 'No purchased applications'}
          </Typography>
          <Typography sx={{ mt: 0.75, fontSize: 13.5, color: applyFlow.inkMuted, maxWidth: 360, mx: 'auto' }}>
            {tab === 'ongoing'
              ? 'Start a visa application and pick up exactly where you left off.'
              : 'Applications appear here after payment while we process your visa.'}
          </Typography>
          {tab === 'ongoing' ? (
            <AccentButton sx={{ mt: 2.5 }} onClick={() => navigate('/countries')}>
              Browse destinations
            </AccentButton>
          ) : null}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            // Two-up only once the main column is genuinely wide enough — the project's
            // `desktop` key is 1024px (see src/design-system/breakpoints.ts).
            gridTemplateColumns: { xs: '1fr', desktop: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
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
        </Box>
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
        transition: `background-color 140ms ${applyMotion.easeOut}, border-color 140ms ${applyMotion.easeOut}, color 140ms ${applyMotion.easeOut}`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': {
            borderColor: applyFlow.accentBorder,
            color: applyFlow.accentInk,
          },
        },
        ...focusRingSx,
      }}
      aria-pressed={active}
    >
      {label}
    </Box>
  )
}
