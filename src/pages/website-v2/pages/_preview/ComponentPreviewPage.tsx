import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Clock } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { FileUploadModal } from '@/pages/website-v2/components/fileUploadModal/FileUploadModal'
import { BulkUploadDropzone } from '@/pages/website-v2/components/bulkUpload/BulkUploadDropzone'
import { TravellerUploadStatusRow } from '@/pages/website-v2/components/bulkUpload/TravellerUploadStatusRow'
import type { TravellerUploadStatusItem } from '@/pages/website-v2/components/bulkUpload/types'
import { LiveStatusPanel } from '@/pages/website-v2/components/liveStatusPanel/LiveStatusPanel'
import { StatusStepper } from '@/pages/website-v2/components/statusStepper/StatusStepper'
import type { StatusStepConfig } from '@/pages/website-v2/components/statusStepper/types'

const SAMPLE_TRAVELLERS: TravellerUploadStatusItem[] = [
  { id: '1', name: 'Aditi Sharma', status: 'uploaded', fileName: 'aditi_passport.jpg', quality: { confidence: 96 } },
  { id: '2', name: 'Rohan Verma', status: 'uploaded', fileName: 'rohan_passport.jpg', quality: { confidence: 71 } },
  { id: '3', name: 'Meera Iyer', status: 'needs_attention', attentionReason: 'Photo page is blurry — details unreadable' },
  { id: '4', name: 'Karan Mehta', status: 'processing' },
  { id: '5', name: 'Priya Nair', status: 'uploading' },
  { id: '6', name: 'Sanjay Gupta', status: 'pending' },
]

const TRACKING_STEPS: StatusStepConfig[] = [
  { id: 'submitted', label: 'Application submitted', description: 'Aug 12, 2026 · 10:42 AM', state: 'completed' },
  { id: 'docs', label: 'Documents verified', description: 'Aug 14, 2026 · 3:05 PM', state: 'completed' },
  { id: 'review', label: 'Consulate review', description: 'Usually takes 3–5 business days', state: 'current', icon: Clock },
  { id: 'approved', label: 'Visa approved', state: 'pending' },
  { id: 'ready', label: 'Ready for collection', state: 'pending' },
]

const HORIZONTAL_STEPS: StatusStepConfig[] = [
  { id: 'details', label: 'Details', state: 'completed' },
  { id: 'documents', label: 'Documents', state: 'completed' },
  { id: 'payment', label: 'Payment', state: 'current', icon: Clock },
  { id: 'review', label: 'Review', state: 'pending' },
  { id: 'confirmed', label: 'Confirmed', state: 'pending' },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  const colors = usePublicBrandColors()
  return (
    <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.navy }}>{children}</Typography>
  )
}

/** Temporary, unrouted-from-nav preview for sanity-checking new status/upload components in isolation. Safe to delete. */
export default function ComponentPreviewPage() {
  const colors = usePublicBrandColors()
  const [modalOpen, setModalOpen] = useState(false)
  const [lastUpload, setLastUpload] = useState<string[]>([])
  const [bulkFiles, setBulkFiles] = useState<string[]>([])

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', px: 3, py: 6 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: colors.navy, mb: 4 }}>
        Component preview — live status visual language
      </Typography>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>LiveStatusPanel</SectionLabel>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <LiveStatusPanel
              headline={{ eyebrow: 'Approval likelihood', value: '94%', caption: 'Based on your route and travel dates' }}
              bullets={[
                '94% approved on this route in the last 90 days',
                'Avg. processing time: 6 business days',
                'No additional documents typically required',
              ]}
              glowTone="gold"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <LiveStatusPanel
              headline={{ eyebrow: 'Estimated approval', value: 'Aug 29', caption: 'If submitted with current documents' }}
              bullets={[
                '3 of 5 steps already complete',
                'Consulate review usually takes 3–5 days',
                "We'll notify you the moment it moves",
              ]}
              glowTone="green"
            />
          </Box>
        </Stack>
      </Stack>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>StatusStepper — vertical (Application Tracking / Cancellation Policy)</SectionLabel>
        <Box sx={{ p: 2.5, borderRadius: '8px', border: `1px solid ${colors.border}`, bgcolor: colors.white }}>
          <StatusStepper steps={TRACKING_STEPS} />
        </Box>
      </Stack>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>StatusStepper — horizontal (generic top-level progress)</SectionLabel>
        <Box sx={{ p: 2.5, borderRadius: '8px', border: `1px solid ${colors.border}`, bgcolor: colors.white }}>
          <StatusStepper steps={HORIZONTAL_STEPS} orientation="horizontal" />
        </Box>
      </Stack>

      <Stack spacing={1.25} sx={{ mb: 5 }}>
        <SectionLabel>FileUploadModal (redesigned)</SectionLabel>
        <Box>
          <Button label="Open upload modal" variant="outlined" onClick={() => setModalOpen(true)} />
        </Box>
        {lastUpload.length > 0 ? (
          <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
            Last upload: {lastUpload.join(', ')}
          </Typography>
        ) : null}
      </Stack>

      <Stack spacing={1.5} sx={{ mb: 5 }}>
        <SectionLabel>BulkUploadDropzone (redesigned)</SectionLabel>
        <BulkUploadDropzone onFilesSelected={(files) => setBulkFiles(files.map((f) => f.name))} />
        {bulkFiles.length > 0 ? (
          <Typography sx={{ fontSize: 12, color: colors.textMuted }}>Selected: {bulkFiles.join(', ')}</Typography>
        ) : null}
      </Stack>

      <Stack spacing={1.5}>
        <SectionLabel>TravellerUploadStatusRow (redesigned)</SectionLabel>
        <Stack spacing={1}>
          {SAMPLE_TRAVELLERS.map((item) => (
            <TravellerUploadStatusRow
              key={item.id}
              item={item}
              onReupload={(id) => console.log('reupload requested for', id)}
            />
          ))}
        </Stack>
      </Stack>

      <FileUploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        documentName="Bank statement"
        description="Last 3 months, showing your name and account number."
        onUpload={(files) => setLastUpload(files.map((f) => f.name))}
      />
    </Box>
  )
}
