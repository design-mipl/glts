import { useState } from 'react'
import { Box, Typography, Stack, Grid } from '@mui/material'
import {
  Alert, Modal, Drawer, ConfirmDialog, LoadingOverlay,
  ProgressBar, SkeletonCard, SkeletonList, SkeletonTable,
  Popover, useToast, Divider, Button,
} from '@/design-system/UIComponents'

export function FeedbackShowcase() {
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const triggerLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <Box>
      <Grid container spacing={4}>
        {/* Alert */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Alert</Typography>
          <Stack gap={1.5}>
            <Alert severity="info" title="Information">This is an informational message.</Alert>
            <Alert severity="success" title="Success">Your changes have been saved successfully.</Alert>
            <Alert severity="warning" title="Warning">Please review your settings before continuing.</Alert>
            <Alert severity="error" title="Error">Something went wrong. Please try again.</Alert>
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Toast */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Toast</Typography>
          <Stack direction="row" gap={1.5} flexWrap="wrap">
            <Button variant="contained" onClick={() => showToast({ title: 'Changes saved!', variant: 'success' })}>
              Success Toast
            </Button>
            <Button variant="outlined" onClick={() => showToast({ title: 'Something went wrong.', variant: 'error' })}>
              Error Toast
            </Button>
            <Button variant="text" onClick={() => showToast({ title: 'Check your input.', variant: 'warning' })}>
              Warning Toast
            </Button>
            <Button variant="text" onClick={() => showToast({ title: 'Update available.', variant: 'info' })}>
              Info Toast
            </Button>
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Modal, Drawer, ConfirmDialog */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Modal / Drawer / ConfirmDialog</Typography>
          <Stack direction="row" gap={1.5} flexWrap="wrap">
            <Button variant="contained" onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Button variant="outlined" onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
            <Button variant="text" onClick={() => setConfirmOpen(true)}>Confirm Dialog</Button>
            <Button variant="text" onClick={triggerLoading}>Loading Overlay (2s)</Button>
          </Stack>

          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Modal Dialog">
            <Typography variant="body2">
              This is the modal body. You can put any content here â€” forms, details, confirmations.
            </Typography>
            <Stack direction="row" gap={1} sx={{ mt: 3 }} justifyContent="flex-end">
              <Button variant="neutral" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={() => setModalOpen(false)}>Confirm</Button>
            </Stack>
          </Modal>

          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Side Drawer">
            <Typography variant="body2">
              Drawer content slides in from the right. Ideal for forms, filters, and detail panels.
            </Typography>
          </Drawer>

          <ConfirmDialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={() => { setConfirmOpen(false); showToast({ title: 'Deleted!', variant: 'success' }) }}
            title="Delete Item"
            description="Are you sure you want to delete this item? This action cannot be undone."
            confirmLabel="Delete"
            variant="destructive"
          />
        </Grid>

        {/* LoadingOverlay wraps content */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>LoadingOverlay</Typography>
          <LoadingOverlay loading={isLoading} label="Processing...">
            <Box sx={{ p: 3, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="body2">Content wrapped by LoadingOverlay. Click "Loading Overlay" above to see it.</Typography>
            </Box>
          </LoadingOverlay>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* ProgressBar */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>ProgressBar</Typography>
          <Stack gap={2}>
            <ProgressBar value={30} label="Storage" showValue />
            <ProgressBar value={65} color="success" label="Completion" showValue />
            <ProgressBar value={85} color="warning" label="CPU Usage" showValue />
            <ProgressBar value={95} color="error" label="Memory" showValue />
          </Stack>
        </Grid>

        {/* Popover */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Popover</Typography>
          <Stack direction="row" gap={2}>
            <Popover
              trigger={<Button variant="outlined">Click Popover</Button>}
              title="Popover title"
            >
              <Typography variant="body2" color="text.secondary">Content appears here.</Typography>
            </Popover>
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Skeleton */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Skeleton</Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>SkeletonCard</Typography>
              <SkeletonCard />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>SkeletonList</Typography>
              <SkeletonList count={4} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>SkeletonTable</Typography>
              <SkeletonTable count={3} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

