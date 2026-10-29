import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { FileUploadModal } from '@/pages/website/components/fileUploadModal/FileUploadModal'
import { BulkUploadDropzone } from '@/pages/website/components/bulkUpload/BulkUploadDropzone'
import { TravellerUploadStatusRow } from '@/pages/website/components/bulkUpload/TravellerUploadStatusRow'
import type { TravellerUploadStatusItem } from '@/pages/website/components/bulkUpload/types'
import { LiveStatusPanel } from '@/pages/website/components/liveStatusPanel/LiveStatusPanel'
import { StatusStepper } from '@/pages/website/components/statusStepper/StatusStepper'
import type { StatusStepConfig } from '@/pages/website/components/statusStepper/types'
import {
  ChecklistStep,
  checklistUploadKey,
} from '@/pages/website/pages/RetailApplyFlowPage/components/steps/ChecklistStep'
import { SuccessStep } from '@/pages/website/pages/RetailApplyFlowPage/components/steps/SuccessStep'
import { PaymentStep } from '@/pages/website/pages/RetailApplyFlowPage/components/steps/PaymentStep'
import { OriginalDocumentsStep } from '@/pages/website/pages/RetailApplyFlowPage/components/steps/OriginalDocumentsStep'
import { CollectionMethodStep } from '@/pages/website/pages/RetailApplyFlowPage/components/steps/CollectionMethodStep'
import { CollectionDetailsStep } from '@/pages/website/pages/RetailApplyFlowPage/components/steps/CollectionDetailsStep'
import { SponsorStep } from '@/pages/website/pages/RetailApplyFlowPage/components/steps/SponsorStep'
import { InsuranceStep } from '@/pages/website/pages/RetailApplyFlowPage/components/steps/InsuranceStep'
import { FlightTicketStep } from '@/pages/website/pages/RetailApplyFlowPage/components/steps/FlightTicketStep'
import { ReviewStep } from '@/pages/website/pages/RetailApplyFlowPage/components/steps/ReviewStep'
import type { OriginalDocumentCollectionMethod } from '@/shared/types/originalDocumentCollection'
import type { RetailChecklistDocument } from '@/shared/services/retailJourneyResolver'
import type { RetailJourney } from '@/shared/services/retailJourneyResolver'
import type {
  RetailApplicantParty,
  RetailCapturedImage,
  RetailExtraSelection,
  RetailFlowDraft,
} from '@/pages/website/pages/RetailApplyFlowPage/types'
import { EMPTY_TRAVELLER_DETAILS } from '@/pages/website/pages/RetailApplyFlowPage/types'
import { getElevatedStatusCardSx } from '@/pages/website/theme/statusVisualTokens'
import type { ServiceMaster } from '@/shared/types/serviceMaster'

const SAMPLE_TRAVELLERS: TravellerUploadStatusItem[] = [
  { id: '1', name: 'Aditi Sharma', status: 'uploaded', fileName: 'aditi_passport.jpg', quality: { confidence: 96 } },
  { id: '2', name: 'Rohan Verma', status: 'uploaded', fileName: 'rohan_passport.jpg', quality: { confidence: 71 } },
  { id: '7', name: 'Neha Kapoor', status: 'uploaded', fileName: 'neha_passport.jpg', quality: { confidence: 48 } },
  { id: '3', name: 'Meera Iyer', status: 'needs_attention', attentionReason: 'Photo page is blurry — details unreadable' },
  { id: '4', name: 'Karan Mehta', status: 'processing' },
  { id: '5', name: 'Priya Nair', status: 'uploading' },
  { id: '6', name: 'Sanjay Gupta', status: 'pending' },
]

const TRACKING_STEPS: StatusStepConfig[] = [
  { id: 'submitted', label: 'Application submitted', description: 'Aug 12, 2026 · 10:42 AM', state: 'completed' },
  { id: 'docs', label: 'Documents verified', description: 'Aug 14, 2026 · 3:05 PM', state: 'completed' },
  { id: 'review', label: 'Consulate review', description: 'Usually takes 3–5 business days', state: 'current' },
  { id: 'approved', label: 'Visa approved', state: 'pending' },
  { id: 'ready', label: 'Ready for collection', state: 'pending' },
]

const HORIZONTAL_STEPS: StatusStepConfig[] = [
  { id: 'details', label: 'Details', state: 'completed' },
  { id: 'documents', label: 'Documents', state: 'completed' },
  { id: 'payment', label: 'Payment', state: 'current' },
  { id: 'review', label: 'Review', state: 'pending' },
  { id: 'confirmed', label: 'Confirmed', state: 'pending' },
]

const PREVIEW_DOCS: RetailChecklistDocument[] = [
  {
    documentId: 'photo',
    name: 'Photograph',
    description: 'Recent passport-size photo on a white background.',
    mandatory: true,
    originalDocument: false,
  },
  {
    documentId: 'passport',
    name: 'Passport',
    description: 'Bio page — clear and fully visible.',
    mandatory: true,
    originalDocument: true,
  },
  {
    documentId: 'bank_statement',
    name: 'Bank statement',
    description: 'Last 3 months, showing your name and account number.',
    mandatory: true,
    originalDocument: false,
  },
  {
    documentId: 'cover_letter',
    name: 'Cover letter',
    description: 'Optional supporting letter for your trip.',
    mandatory: false,
    originalDocument: false,
  },
  {
    documentId: 'noc',
    name: 'NOC from employer',
    description: 'On company letterhead with stamp and signature.',
    mandatory: true,
    originalDocument: true,
  },
]

const PREVIEW_APPLICANTS: RetailApplicantParty[] = [
  {
    id: 't1',
    label: 'You',
    details: { ...EMPTY_TRAVELLER_DETAILS, fullName: 'Aditi Sharma' },
    sponsor: { mode: 'individual' },
    photo: { dataUrl: 'data:preview', capturedAt: new Date().toISOString() },
    passport: { dataUrl: 'data:preview', capturedAt: new Date().toISOString() },
    profileAnswers: { maritalStatus: 'single', profession: 'salaried' },
  },
  {
    id: 't2',
    label: 'Traveller 2',
    details: { ...EMPTY_TRAVELLER_DETAILS, fullName: 'Rohan Verma' },
    sponsor: {
      mode: 'someone_else',
      name: 'Meera Verma',
      relationship: 'Mother',
      contact: '+91 98765 43210',
    },
    photo: { dataUrl: 'data:preview', capturedAt: new Date().toISOString() },
    profileAnswers: { maritalStatus: 'married', profession: 'self_employed' },
  },
  {
    id: 't3',
    label: 'Traveller 3',
    details: { ...EMPTY_TRAVELLER_DETAILS, fullName: 'Meera Iyer' },
    profileAnswers: { maritalStatus: 'single', profession: 'student' },
  },
]

const PREVIEW_INSURANCE_SERVICE: ServiceMaster = {
  id: 'svc-travel-insurance',
  serviceCode: 'SVC-FEE-001',
  serviceType: 'glts',
  serviceName: 'Travel insurance',
  description: 'Travel insurance charge for visa applicants',
  category: 'Travel Support',
  subcategory: 'Insurance Support',
  defaultPrice: 1800,
  mappedSacCodeId: 'sac-998599',
  gstRateId: 'gst-12',
  tdsSectionId: null,
  applicableFor: ['retail'],
  status: 'active',
  createdBy: 'preview',
  updatedBy: 'preview',
  createdAt: '2026-01-18T08:00:00.000Z',
  updatedAt: '2026-02-13T10:00:00.000Z',
}

const PREVIEW_TICKET_SERVICE: ServiceMaster = {
  id: 'svc-e-ticket',
  serviceCode: 'SVC-FEE-002',
  serviceType: 'glts',
  serviceName: 'E-ticket',
  description: 'E-ticket booking and issuance fee',
  category: 'Travel Support',
  subcategory: 'Itinerary Planning',
  defaultPrice: 500,
  mappedSacCodeId: 'sac-998599',
  gstRateId: 'gst-12',
  tdsSectionId: null,
  applicableFor: ['retail'],
  status: 'active',
  createdBy: 'preview',
  updatedBy: 'preview',
  createdAt: '2026-03-01T08:00:00.000Z',
  updatedAt: '2026-03-01T08:00:00.000Z',
}

const PREVIEW_REVIEW_JOURNEY = {
  country: { name: 'France', code: 'FR' },
  visaType: { name: 'Tourist visa' },
  allowsPhysicalOriginalDocuments: true,
  documents: PREVIEW_DOCS,
  insuranceServices: [PREVIEW_INSURANCE_SERVICE],
  flightTicketServices: [PREVIEW_TICKET_SERVICE],
} as unknown as RetailJourney

const PREVIEW_SUCCESS_JOURNEY = {
  country: { name: 'France', code: 'FR' },
  visaType: { name: 'Tourist visa' },
} as unknown as RetailJourney

const PREVIEW_PAYMENT_JOURNEY = {
  country: { name: 'France', code: 'FR' },
  visaType: { name: 'Tourist visa', validity: '30 days' },
  offering: { validity: '30 days' },
  allowsPhysicalOriginalDocuments: true,
  insuranceServices: [],
  flightTicketServices: [],
  pricing: {
    visaFee: [
      { id: 'vf1', label: 'Visa fee', amount: 8000, gstIncluded: true },
    ],
    vfsServiceRates: [
      {
        id: 'vfs1',
        serviceName: 'VFS service charge',
        amount: 2100,
        gstIncluded: true,
        sortOrder: 1,
      },
    ],
    total: 10100,
  },
} as unknown as RetailJourney

function buildPreviewPaymentDraft(): RetailFlowDraft {
  return {
    countryId: 'fr',
    visaOfferingId: 'tourist',
    jurisdictionId: 'Mumbai VAC',
    travelDate: '2026-09-18',
    answers: {},
    traveller: { ...EMPTY_TRAVELLER_DETAILS, fullName: 'Aditi Sharma' },
    applicants: PREVIEW_APPLICANTS.slice(0, 2),
    documentUploads: {},
    collectionMethod: 'picked_up_from_company',
    collectionDetails: {
      pickupAddress: 'Maker Chambers, Nariman Point, Mumbai 400021',
      addressLine1: 'Maker Chambers, Nariman Point',
      pinCode: '400021',
      city: 'Mumbai',
      state: 'Maharashtra',
    },
    insurance: { choice: 'skip' },
    flightTicket: { choice: 'skip' },
    processingTier: 'standard',
    paymentMethod: 'upi',
    paymentComplete: false,
  }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const colors = usePublicBrandColors()
  return (
    <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.navy }}>{children}</Typography>
  )
}

/**
 * Dev-only component reference for status/upload surfaces.
 * Routed only when `import.meta.env.DEV` — not linked from product navigation.
 */
export default function ComponentPreviewPage() {
  const colors = usePublicBrandColors()
  const [modalOpen, setModalOpen] = useState(false)
  const [lastUpload, setLastUpload] = useState<string[]>([])
  const [bulkFiles, setBulkFiles] = useState<string[]>([])
  const [checklistUploads, setChecklistUploads] = useState<Record<string, RetailCapturedImage>>({
    // Aditi has photo+passport on the applicant; bank still open → ~67% ready (ring not stuck at 0%).
  })
  const [bulkByTraveller, setBulkByTraveller] = useState<Record<string, string[]>>({})
  const [paymentDraft, setPaymentDraft] = useState<RetailFlowDraft>(() => buildPreviewPaymentDraft())
  const [collectionMethod, setCollectionMethod] = useState<OriginalDocumentCollectionMethod | undefined>(
    'picked_up_from_company',
  )
  const [collectionDetails, setCollectionDetails] = useState<Record<string, string>>({
    companyName: 'Acme Corp',
    pickupAddress: 'Maker Chambers, Nariman Point, Mumbai 400021',
    addressLine1: 'Maker Chambers, Nariman Point',
    addressLine2: '',
    pinCode: '400021',
    city: 'Mumbai',
    state: 'Maharashtra',
    deliveryInstructions: '',
    contactPerson: '',
    contactNumber: '',
    pickupDate: '2026-09-12',
    pickupTime: '10:00–13:00',
    preferredDate: '2026-09-12',
    preferredWindow: '10:00–13:00',
    remarks: '',
    receivingOfficeId: 'office-mumbai',
  })
  const [sponsorApplicants, setSponsorApplicants] = useState(PREVIEW_APPLICANTS.slice(0, 2))
  const [insuranceChoice, setInsuranceChoice] = useState<RetailExtraSelection>({ choice: 'skip' })
  const [insuranceGlts, setInsuranceGlts] = useState<RetailExtraSelection>({
    choice: 'glts_arranged',
    serviceId: PREVIEW_INSURANCE_SERVICE.id,
  })
  const [flightGlts, setFlightGlts] = useState<RetailExtraSelection>({
    choice: 'glts_arranged',
    serviceId: PREVIEW_TICKET_SERVICE.id,
  })
  const [reviewBanner, setReviewBanner] = useState(true)

  // Belt-and-suspenders: page is only routed in DEV, but never render in production chunks.
  if (!import.meta.env.DEV) {
    return null
  }

  return (
    <Box sx={{ maxWidth: 1120, mx: 'auto', px: 3, py: 6 }}>
      <Box
        sx={{
          mb: 3,
          px: 2,
          py: 1.5,
          borderRadius: '10px',
          border: `1px solid ${colors.border}`,
          bgcolor: colors.surfaceAlt,
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.navy, lineHeight: 1.45 }}>
          Dev only — component reference, not the real apply flow. May not reflect the latest
          component versions if this page is not manually updated.
        </Typography>
      </Box>

      <Typography sx={{ fontSize: 22, fontWeight: 700, color: colors.navy, mb: 4 }}>
        Component preview — live status visual language
      </Typography>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>OriginalDocumentsStep — checklist rows + Original required (B15)</SectionLabel>
        <Box
          sx={{
            ...getElevatedStatusCardSx(colors.border),
            borderRadius: '12px',
            bgcolor: colors.white,
            p: { xs: 2.5, md: 3.5 },
          }}
        >
          <OriginalDocumentsStep
            documents={PREVIEW_DOCS}
            applicants={PREVIEW_APPLICANTS}
            uploads={{}}
            onBack={() => undefined}
            onContinue={() => undefined}
          />
        </Box>
      </Stack>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>SponsorStep — per traveller Individual / Someone else (B10)</SectionLabel>
        <Box
          sx={{
            ...getElevatedStatusCardSx(colors.border),
            borderRadius: '12px',
            bgcolor: colors.white,
            p: { xs: 2.5, md: 3.5 },
            maxHeight: 720,
            overflow: 'auto',
          }}
        >
          <SponsorStep
            applicants={sponsorApplicants}
            onUpdateSponsor={(applicantId, sponsor) =>
              setSponsorApplicants((prev) =>
                prev.map((a) => (a.id === applicantId ? { ...a, sponsor } : a)),
              )
            }
            onGoToTravelProfile={() => undefined}
            onBack={() => undefined}
            onContinue={() => undefined}
          />
        </Box>
      </Stack>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>CollectionMethodStep — icon card grid (B16)</SectionLabel>
        <Box
          sx={{
            ...getElevatedStatusCardSx(colors.border),
            borderRadius: '12px',
            bgcolor: colors.white,
            p: { xs: 2.5, md: 3.5 },
          }}
        >
          <CollectionMethodStep
            selectedMethod={collectionMethod}
            onSelect={setCollectionMethod}
            onBack={() => undefined}
            onContinue={() => undefined}
          />
        </Box>
      </Stack>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>
          CollectionDetailsStep — all 4 methods (grid + Pickup / Drop / Courier / Hand-carry)
        </SectionLabel>
        <Box
          sx={{
            ...getElevatedStatusCardSx(colors.border),
            borderRadius: '12px',
            bgcolor: colors.white,
            p: { xs: 2.5, md: 3.5 },
            maxHeight: 820,
            overflow: 'auto',
          }}
        >
          <CollectionDetailsStep
            method={collectionMethod ?? 'picked_up_from_company'}
            values={collectionDetails}
            onSelectMethod={setCollectionMethod}
            onChange={(key, value) =>
              setCollectionDetails((prev) => ({ ...prev, [key]: value }))
            }
            onBack={() => undefined}
            onContinue={() => undefined}
          />
        </Box>
      </Stack>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>InsuranceStep — segmented choice (B17)</SectionLabel>
        <Box
          sx={{
            ...getElevatedStatusCardSx(colors.border),
            borderRadius: '12px',
            bgcolor: colors.white,
            p: { xs: 2.5, md: 3.5 },
          }}
        >
          <InsuranceStep
            services={[PREVIEW_INSURANCE_SERVICE]}
            selection={insuranceChoice}
            travelDate="2026-09-12"
            onChange={setInsuranceChoice}
            onBack={() => undefined}
            onContinue={() => undefined}
          />
        </Box>
      </Stack>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>InsuranceStep — Get from GLTS detail (B17)</SectionLabel>
        <Box
          sx={{
            ...getElevatedStatusCardSx(colors.border),
            borderRadius: '12px',
            bgcolor: colors.white,
            p: { xs: 2.5, md: 3.5 },
          }}
        >
          <InsuranceStep
            services={[PREVIEW_INSURANCE_SERVICE]}
            selection={insuranceGlts}
            travelDate="2026-09-12"
            onChange={setInsuranceGlts}
            onBack={() => undefined}
            onContinue={() => undefined}
          />
        </Box>
      </Stack>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>FlightTicketStep — Get from GLTS detail (B17)</SectionLabel>
        <Box
          sx={{
            ...getElevatedStatusCardSx(colors.border),
            borderRadius: '12px',
            bgcolor: colors.white,
            p: { xs: 2.5, md: 3.5 },
          }}
        >
          <FlightTicketStep
            services={[PREVIEW_TICKET_SERVICE]}
            selection={flightGlts}
            travelDate="2026-09-12"
            onChange={setFlightGlts}
            onBack={() => undefined}
            onContinue={() => undefined}
          />
        </Box>
      </Stack>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>ReviewStep — accordion travellers + categories + requirements banner (B18)</SectionLabel>
        <Box
          sx={{
            ...getElevatedStatusCardSx(colors.border),
            borderRadius: '12px',
            bgcolor: colors.white,
            p: { xs: 2.5, md: 3.5 },
            maxHeight: 820,
            overflow: 'auto',
          }}
        >
          <ReviewStep
            journey={PREVIEW_REVIEW_JOURNEY}
            draft={{
              ...paymentDraft,
              insurance: { choice: 'glts_arranged', serviceId: PREVIEW_INSURANCE_SERVICE.id },
              flightTicket: { choice: 'self_provided' },
              documentUploads: {
                ...checklistUploads,
                [checklistUploadKey('t1', 'bank_statement')]: {
                  dataUrl: 'data:preview',
                  capturedAt: new Date().toISOString(),
                },
              },
            }}
            requirementsUpdated={reviewBanner}
            onDismissRequirementsUpdated={() => setReviewBanner(false)}
            onEditStep={() => undefined}
            onBack={() => undefined}
            onContinue={() => undefined}
          />
        </Box>
      </Stack>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>PaymentStep — trip summary + upgrade + expandable breakdown (B19)</SectionLabel>
        <Box
          sx={{
            ...getElevatedStatusCardSx(colors.border),
            borderRadius: '12px',
            bgcolor: colors.white,
            p: { xs: 2.5, md: 3.5 },
            maxHeight: 720,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <PaymentStep
            journey={PREVIEW_PAYMENT_JOURNEY}
            draft={paymentDraft}
            onChange={(patch) => setPaymentDraft((prev) => ({ ...prev, ...patch }))}
            onBack={() => undefined}
            onPay={() => undefined}
          />
        </Box>
      </Stack>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>SuccessStep — boarding-pass confirmation (B20)</SectionLabel>
        <SuccessStep
          journey={PREVIEW_SUCCESS_JOURNEY}
          applicationReference="GLTS-2026-0842"
          submittedAt="27 Aug 2026"
          nextExpectedUpdate="31 Aug 2026"
        />
      </Stack>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>ChecklistStep — two-column flex (list + bulk upload + readiness)</SectionLabel>
        <ChecklistStep
          previewOnly
          documents={PREVIEW_DOCS}
          applicants={PREVIEW_APPLICANTS}
          uploads={checklistUploads}
          estimatedApproval="Aug 29"
          onUpload={(documentId, image, applicantId) =>
            setChecklistUploads((prev) => ({
              ...prev,
              [checklistUploadKey(applicantId, documentId)]: image,
            }))
          }
          onBulkFilesSelected={(applicantId, files) =>
            setBulkByTraveller((prev) => ({
              ...prev,
              [applicantId]: files.map((f) => f.name),
            }))
          }
          onBack={() => undefined}
          onContinue={() => undefined}
        />
        {Object.keys(bulkByTraveller).length > 0 ? (
          <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
            Bulk picks:{' '}
            {Object.entries(bulkByTraveller)
              .map(([id, names]) => `${id}: ${names.join(', ')}`)
              .join(' · ')}
          </Typography>
        ) : null}
      </Stack>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>LiveStatusPanel (grid overlay + live dot)</SectionLabel>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <LiveStatusPanel
              headline={{ eyebrow: 'Approval likelihood', value: '94%', caption: 'Based on your route and travel dates' }}
              bullets={[
                '94% approved on this route in the last 90 days',
                'Avg. processing time: 6 business days',
                'No additional documents typically required',
              ]}
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
            />
          </Box>
        </Stack>
      </Stack>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>StatusStepper — vertical (Application Tracking / Cancellation Policy)</SectionLabel>
        <Box sx={{ p: 2.5, borderRadius: '8px', ...getElevatedStatusCardSx(colors.border), bgcolor: colors.white }}>
          <StatusStepper steps={TRACKING_STEPS} />
        </Box>
      </Stack>

      <Stack spacing={2} sx={{ mb: 5 }}>
        <SectionLabel>StatusStepper — horizontal (generic top-level progress)</SectionLabel>
        <Box sx={{ p: 2.5, borderRadius: '8px', ...getElevatedStatusCardSx(colors.border), bgcolor: colors.white }}>
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
