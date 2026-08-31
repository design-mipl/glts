import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Collapse, Typography } from '@mui/material'
import {
  Camera,
  ChevronDown,
  FileText,
  HandCoins,
  IdCard,
  IndianRupee,
  UserRound,
} from 'lucide-react'
import { WhyWeAskSheet } from '@/pages/website/components/WhyWeAskSheet'
import { resolveDocumentWhyContent, type DocumentWhyContent } from '@/pages/website/config/documentWhyContent'
import { DocumentChecklistRow } from '@/pages/website/components/documentChecklist/DocumentChecklistRow'
import {
  BulkUploadDropzone,
  type BulkUploadDropzoneHandle,
} from '@/pages/website/components/bulkUpload/BulkUploadDropzone'
import { initialsFromName } from '../../config/travelProfileQuestions'
import { StepShell } from '../StepShell'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  tabularNums,
} from '@/pages/website/theme/applyFlowTheme'
import type { RetailChecklistDocument } from '@/shared/services/retailJourneyResolver'
import {
  SPONSOR_BANK_STATEMENT_DOC_ID,
  type RetailApplicantParty,
  type RetailCapturedImage,
} from '../../types'

type DocCategory = 'personal' | 'financial' | 'other'

interface ChecklistStepProps {
  documents: RetailChecklistDocument[]
  applicants: RetailApplicantParty[]
  uploads: Record<string, RetailCapturedImage>
  onUpload: (documentId: string, image: RetailCapturedImage, applicantId: string) => void
  onBack: () => void
  onContinue: () => void
  /** Estimated approval date/time shown beside the readiness figure. */
  estimatedApproval?: string
  /** When true, render only the checklist body (no StepShell) — isolated preview. */
  previewOnly?: boolean
  onBulkFilesSelected?: (applicantId: string, files: File[]) => void
}

export function checklistUploadKey(applicantId: string, documentId: string) {
  return `${applicantId}__${documentId}`
}

function categorizeDocument(doc: RetailChecklistDocument): DocCategory {
  const hay = `${doc.documentId} ${doc.name}`.toLowerCase()
  if (/bank|statement|itr|salary|financial|funds|balance|income/.test(hay)) return 'financial'
  if (/photo|passport|aadhaar|aadhar|pan|identity|birth|national|id.?card/.test(hay)) return 'personal'
  return 'other'
}

function isIdentityCaptureDoc(documentId: string): 'photo' | 'passport' | null {
  const id = documentId.toLowerCase()
  if (id === 'photo' || id === 'photograph') return 'photo'
  if (id.includes('photo') && !id.includes('passport')) return 'photo'
  if (id === 'passport') return 'passport'
  if (id.includes('passport') && !/old|stamp|back|front|all|pages/.test(id)) return 'passport'
  return null
}

/** Passport + photo are captured earlier — always show them under Personal as completed when present. */
const ESSENTIAL_PERSONAL_DOCS: RetailChecklistDocument[] = [
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
]

/** Synthesised only when a sponsor's requirement pack contributes no financial document. */
const SPONSOR_FALLBACK_DOC: RetailChecklistDocument = {
  documentId: SPONSOR_BANK_STATEMENT_DOC_ID,
  name: 'Sponsor bank statement',
  description: "Last 3 months, in the sponsor's name — not the traveller's.",
  mandatory: true,
  originalDocument: false,
}

function withEssentialPersonalDocs(documents: RetailChecklistDocument[]): RetailChecklistDocument[] {
  const hasPhoto = documents.some((doc) => isIdentityCaptureDoc(doc.documentId) === 'photo')
  const hasPassport = documents.some((doc) => isIdentityCaptureDoc(doc.documentId) === 'passport')
  const missing = ESSENTIAL_PERSONAL_DOCS.filter((doc) => {
    if (doc.documentId === 'photo') return !hasPhoto
    if (doc.documentId === 'passport') return !hasPassport
    return false
  })
  if (missing.length === 0) return documents
  return [...missing, ...documents]
}

function docIcon(doc: RetailChecklistDocument) {
  const hay = `${doc.documentId} ${doc.name}`.toLowerCase()
  if (/photo|photograph/.test(hay)) return Camera
  if (/passport/.test(hay)) return FileText
  if (/aadhaar|aadhar|pan|id/.test(hay)) return IdCard
  if (/bank|statement|financial|salary|itr/.test(hay)) return IndianRupee
  return FileText
}

function isDocComplete(
  doc: RetailChecklistDocument,
  applicant: RetailApplicantParty,
  uploads: Record<string, RetailCapturedImage>,
): boolean {
  const identity = isIdentityCaptureDoc(doc.documentId)
  if (identity === 'photo' && applicant.photo) return true
  if (identity === 'passport' && applicant.passport) return true
  return Boolean(
    uploads[checklistUploadKey(applicant.id, doc.documentId)] || uploads[doc.documentId],
  )
}

const CATEGORY_LABEL: Record<DocCategory, string> = {
  personal: 'Personal',
  financial: 'Financial',
  other: 'Supporting',
}

/**
 * One collapsible party in the document list — a traveller, or the sponsor funding one.
 *
 * Sections exist because the flat list did not survive contact with reality: ten travellers
 * at a dozen documents each is 120 rows with nothing telling you whose passport you are
 * looking at. Everything here is derived from the resolved requirement pack, so a six-,
 * ten- or fifteen-document configuration renders without any change to this file.
 */
interface DocSubject {
  /** Stable key for open/closed state — an applicant may contribute two subjects. */
  key: string
  applicantId: string
  kind: 'traveller' | 'sponsor'
  name: string
  /** Line under the name, e.g. "Traveller 02" or "Sponsor · funding Priya". */
  role: string
  documents: RetailChecklistDocument[]
}

/**
 * Split the resolved documents across the people who actually have to produce them.
 *
 * A sponsored traveller does not supply their own funds evidence, so the financial
 * documents move to that traveller's sponsor rather than being duplicated in both
 * sections. Upload keys stay `applicantId__documentId` either way, so nothing downstream
 * (review, payment, persistence) needs to know a document was re-attributed.
 */
function buildSubjects(
  applicants: RetailApplicantParty[],
  documents: RetailChecklistDocument[],
): DocSubject[] {
  const subjects: DocSubject[] = []

  applicants.forEach((applicant, index) => {
    const name = applicant.details.fullName.trim() || applicant.label
    const sponsor = applicant.sponsor?.mode === 'someone_else' ? applicant.sponsor : undefined

    const financial = documents.filter((doc) => categorizeDocument(doc) === 'financial')
    const ownDocuments = sponsor ? documents.filter((doc) => !financial.includes(doc)) : documents

    subjects.push({
      key: `${applicant.id}__traveller`,
      applicantId: applicant.id,
      kind: 'traveller',
      name,
      role: index === 0 ? 'Traveller 01 · you' : `Traveller ${String(index + 1).padStart(2, '0')}`,
      documents: ownDocuments,
    })

    if (sponsor) {
      subjects.push({
        key: `${applicant.id}__sponsor`,
        applicantId: applicant.id,
        kind: 'sponsor',
        name: sponsor.name.trim() || 'Sponsor',
        role: `Sponsor · funding ${name}`,
        documents: financial.length > 0 ? financial : [SPONSOR_FALLBACK_DOC],
      })
    }
  })

  return subjects
}

function subjectProgress(
  subject: DocSubject,
  applicant: RetailApplicantParty | undefined,
  uploads: Record<string, RetailCapturedImage>,
) {
  const mandatory = subject.documents.filter((doc) => doc.mandatory)
  const done = applicant
    ? mandatory.filter((doc) => isDocComplete(doc, applicant, uploads)).length
    : 0
  return {
    done,
    total: mandatory.length,
    complete: mandatory.length > 0 && done === mandatory.length,
  }
}

/** Per-row upload state that is not derivable from the draft (in flight / failed). */
type RowStatus = 'verifying' | 'error'

export function ChecklistCard({
  documents,
  applicants,
  uploads,
  onUpload,
  estimatedApproval,
  onBulkFilesSelected,
}: {
  documents: RetailChecklistDocument[]
  applicants: RetailApplicantParty[]
  uploads: Record<string, RetailCapturedImage>
  onUpload: (documentId: string, image: RetailCapturedImage, applicantId: string) => void
  estimatedApproval?: string
  onBulkFilesSelected?: (applicantId: string, files: File[]) => void
}) {
  const namedApplicants = applicants.filter((a) => a.details.fullName.trim())
  const list = namedApplicants.length > 0 ? namedApplicants : applicants

  const checklistDocuments = useMemo(() => withEssentialPersonalDocs(documents), [documents])
  const subjects = useMemo(
    () => buildSubjects(list, checklistDocuments),
    [list, checklistDocuments],
  )

  const [openKey, setOpenKey] = useState(() => subjects[0]?.key ?? '')
  const [whyContent, setWhyContent] = useState<DocumentWhyContent | null>(null)
  /** `applicantId__documentId` -> transient row state. Cleared once the draft has the file. */
  const [rowStatus, setRowStatus] = useState<Record<string, RowStatus>>({})
  const [rowError, setRowError] = useState<Record<string, string>>({})
  const dropzoneRef = useRef<BulkUploadDropzoneHandle | null>(null)

  // A traveller added or removed after this step was opened must not leave the accordion
  // pointing at a party that no longer exists.
  useEffect(() => {
    if (subjects.length === 0) return
    if (subjects.some((subject) => subject.key === openKey)) return
    setOpenKey(subjects[0].key)
  }, [subjects, openKey])

  const openSubject = subjects.find((subject) => subject.key === openKey)

  const totals = useMemo(() => {
    let done = 0
    let total = 0
    for (const subject of subjects) {
      const applicant = list.find((a) => a.id === subject.applicantId)
      const progress = subjectProgress(subject, applicant, uploads)
      done += progress.done
      total += progress.total
    }
    return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) }
  }, [subjects, list, uploads])

  function clearRow(key: string) {
    setRowStatus((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    setRowError((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  /**
   * Read one file into one document slot. Individual uploads and bulk uploads both land
   * here, which is what keeps the two in sync: there is one status per document, set by
   * whichever path produced the file, and a failure marks only that row.
   */
  function ingestFile(applicantId: string, documentId: string, file: File) {
    const key = checklistUploadKey(applicantId, documentId)
    setRowStatus((prev) => ({ ...prev, [key]: 'verifying' }))
    setRowError((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })

    const reader = new FileReader()
    reader.onload = () => {
      onUpload(
        documentId,
        { dataUrl: String(reader.result ?? ''), capturedAt: new Date().toISOString() },
        applicantId,
      )
      clearRow(key)
    }
    reader.onerror = () => {
      setRowStatus((prev) => ({ ...prev, [key]: 'error' }))
      setRowError((prev) => ({
        ...prev,
        [key]: `We couldn't read “${file.name}”. Upload this document again as a clear PDF or photo.`,
      }))
    }
    reader.readAsDataURL(file)
  }

  /**
   * Bulk intake. Files are matched, in order, to the documents still outstanding for the
   * open party, and each one drives its own row's status — so the individual list shows
   * uploaded / processing / failed per document instead of the bulk block reporting
   * separately and asking for the same files twice.
   */
  function handleBulkFiles(files: File[]) {
    if (!openSubject) return
    const applicant = list.find((a) => a.id === openSubject.applicantId)
    if (!applicant) return

    const outstanding = openSubject.documents.filter(
      (doc) => !isDocComplete(doc, applicant, uploads),
    )
    files.slice(0, outstanding.length).forEach((file, index) => {
      ingestFile(applicant.id, outstanding[index].documentId, file)
    })

    onBulkFilesSelected?.(applicant.id, files)
  }

  return (
    <>
      <Box sx={{ width: '100%' }}>
        {/* Overall readiness across every party — the figure that decides Continue. */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            pb: 2.5,
            mb: 3,
            borderBottom: `1px solid ${applyFlow.hairlineSoft}`,
          }}
        >
          <Typography
            sx={{
              ...tabularNums,
              fontFamily: applyFont.mono,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: applyFlow.inkMuted,
              flex: '0 0 auto',
            }}
          >
            {totals.done} / {totals.total} ready
          </Typography>
          <Box
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={totals.percent}
            aria-label="Document readiness"
            sx={{
              flex: '1 1 auto',
              height: '2px',
              borderRadius: '1px',
              backgroundColor: applyFlow.accentTrack,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${totals.percent}%`,
                backgroundColor: totals.percent === 100 ? applyFlow.success : applyFlow.accent,
                transition: `width 300ms ${applyMotion.easeInOut}, background-color 300ms linear`,
              }}
            />
          </Box>
          {estimatedApproval ? (
            <Typography
              sx={{
                ...tabularNums,
                fontFamily: applyFont.mono,
                fontSize: 10.5,
                color: applyFlow.inkMuted,
                flex: '0 0 auto',
                whiteSpace: 'nowrap',
              }}
            >
              APPROVAL {estimatedApproval}
            </Typography>
          ) : null}
        </Box>

        <BulkUploadDropzone
          openFilePickerRef={dropzoneRef}
          title={
            openSubject
              ? `Drop ${openSubject.name}'s documents together`
              : 'Drop the whole set at once'
          }
          caption="We match each file to the outstanding documents below and mark them off as they land"
          onFilesSelected={handleBulkFiles}
        />

        {/* One section per party. Single-open, so ten travellers stay one screen tall. */}
        <Box sx={{ mt: 3 }}>
          {subjects.map((subject) => {
            const applicant = list.find((a) => a.id === subject.applicantId)
            const progress = subjectProgress(subject, applicant, uploads)
            const open = subject.key === openKey
            const isSponsor = subject.kind === 'sponsor'

            const grouped = (['personal', 'financial', 'other'] as DocCategory[])
              .map((category) => ({
                category,
                docs: subject.documents.filter((doc) => categorizeDocument(doc) === category),
              }))
              .filter((group) => group.docs.length > 0)

            return (
              <Box
                key={subject.key}
                sx={{
                  borderRadius: applyRadius.control,
                  border: `1px solid ${open ? applyFlow.hairlineStrong : applyFlow.hairline}`,
                  backgroundColor: applyFlow.surface,
                  mb: 2,
                  overflow: 'hidden',
                  transition: `border-color 180ms ${applyMotion.easeOut}`,
                }}
              >
                <Box
                  component="button"
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenKey(open ? '' : subject.key)}
                  sx={{
                    appearance: 'none',
                    border: 'none',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2.5,
                    px: 3,
                    py: 2,
                    minHeight: 44,
                    cursor: 'pointer',
                    font: 'inherit',
                    textAlign: 'left',
                    backgroundColor: open ? applyFlow.canvas : 'transparent',
                    transition: `background-color 180ms ${applyMotion.easeOut}`,
                    '&:focus-visible': {
                      outline: 'none',
                      boxShadow: `inset 0 0 0 2px ${applyFlow.accent}`,
                    },
                  }}
                >
                  <Box
                    aria-hidden
                    sx={{
                      width: 26,
                      height: 26,
                      flex: '0 0 auto',
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: applyRadius.chip,
                      backgroundColor: applyFlow.surface,
                      border: `1px solid ${
                        progress.complete ? applyFlow.successBorder : applyFlow.hairline
                      }`,
                      fontFamily: applyFont.mono,
                      fontSize: 11,
                      fontWeight: 700,
                      color: applyFlow.inkMuted,
                    }}
                  >
                    {isSponsor ? (
                      <HandCoins size={14} strokeWidth={1.9} />
                    ) : (
                      initialsFromName(subject.name) || <UserRound size={14} strokeWidth={1.9} />
                    )}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: applyFont.body,
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: applyFlow.ink,
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {subject.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: applyFont.mono,
                        fontSize: 10.5,
                        color: applyFlow.inkMuted,
                        mt: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {subject.role}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      ...tabularNums,
                      fontFamily: applyFont.mono,
                      fontSize: 11,
                      fontWeight: 600,
                      color: progress.complete ? applyFlow.success : applyFlow.inkMuted,
                      flex: '0 0 auto',
                    }}
                  >
                    {progress.done}/{progress.total}
                  </Typography>

                  <ChevronDown
                    size={14}
                    style={{
                      color: applyFlow.inkFaint,
                      flexShrink: 0,
                      transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
                      transition: `transform 180ms ${applyMotion.easeOut}`,
                    }}
                  />
                </Box>

                <Collapse in={open} unmountOnExit>
                  <Box sx={{ px: 3, pb: 1.5 }}>
                    {grouped.map((group, groupIndex) => (
                      <Box key={group.category} sx={{ mt: groupIndex === 0 ? 1 : 2.5 }}>
                        <Typography
                          sx={{
                            fontFamily: applyFont.mono,
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: applyFlow.inkFaint,
                            mb: 0.5,
                          }}
                        >
                          {CATEGORY_LABEL[group.category]}
                        </Typography>
                        {group.docs.map((doc) => {
                          const key = checklistUploadKey(subject.applicantId, doc.documentId)
                          return (
                            <DocumentChecklistRow
                              key={doc.documentId}
                              icon={docIcon(doc)}
                              name={doc.name}
                              dense
                              completed={
                                applicant ? isDocComplete(doc, applicant, uploads) : false
                              }
                              optional={!doc.mandatory}
                              status={rowStatus[key]}
                              errorHint={rowError[key]}
                              onInfoClick={() =>
                                setWhyContent(
                                  resolveDocumentWhyContent({
                                    documentId: doc.documentId,
                                    name: doc.name,
                                    description: doc.description,
                                  }),
                                )
                              }
                              onFileSelect={(file) =>
                                ingestFile(subject.applicantId, doc.documentId, file)
                              }
                            />
                          )
                        })}
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            )
          })}
        </Box>
      </Box>

      <WhyWeAskSheet open={Boolean(whyContent)} content={whyContent} onClose={() => setWhyContent(null)} />
    </>
  )
}

export function ChecklistStep({
  documents,
  applicants,
  uploads,
  onUpload,
  onBack,
  onContinue,
  estimatedApproval,
  previewOnly = false,
  onBulkFilesSelected,
}: ChecklistStepProps) {
  const namedApplicants = applicants.filter((a) => a.details.fullName.trim())
  const list = namedApplicants.length > 0 ? namedApplicants : applicants
  const checklistDocuments = useMemo(() => withEssentialPersonalDocs(documents), [documents])

  const mandatoryComplete = useMemo(() => {
    const subjects = buildSubjects(list, checklistDocuments)
    if (subjects.length === 0) return false
    return subjects.every((subject) => {
      const applicant = list.find((a) => a.id === subject.applicantId)
      if (!applicant) return false
      return subject.documents
        .filter((doc) => doc.mandatory)
        .every((doc) => isDocComplete(doc, applicant, uploads))
    })
  }, [list, checklistDocuments, uploads])

  const card = (
    <ChecklistCard
      documents={checklistDocuments}
      applicants={applicants}
      uploads={uploads}
      onUpload={onUpload}
      estimatedApproval={estimatedApproval}
      onBulkFilesSelected={onBulkFilesSelected}
    />
  )

  if (previewOnly) return card

  return (
    <StepShell
      title="Add your documents"
      helperText="Open a traveller, drop their whole set in one go, and we'll tick each document off as it lands. You can finish this any time in the next 5 days — we start drafting your forms as soon as you check out."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!mandatoryComplete || list.length === 0}
      continueLabel="Continue"
      contentMaxWidth={820}
    >
      {card}
    </StepShell>
  )
}
