import { Box, Typography } from '@mui/material'
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  FileText,
  Image,
  Landmark,
  Plane,
  Shield,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { documentStatusLabel } from '@/shared/utils/applicantDocumentWorkflowUtils'
import { isDocumentComplete } from '../utils/uploadQueueDocuments'
import type { ApplicantDocumentItem } from '../data/applicationFlowData'

type DocStatusTone = 'success' | 'warning' | 'neutral'

function docStatusTone(doc: ApplicantDocumentItem): DocStatusTone {
  if (isDocumentComplete(doc)) return 'success'
  if (doc.status === 'needs_review' || doc.status === 'rejected') return 'warning'
  return 'neutral'
}

function documentIcon(documentId: string): LucideIcon {
  switch (documentId) {
    case 'passport':
      return FileText
    case 'photo':
      return Image
    case 'bank':
      return Landmark
    case 'travel-ticket':
      return Plane
    case 'insurance':
      return Shield
    default:
      return FileText
  }
}

function StatusIcon({ tone, colors }: { tone: DocStatusTone; colors: ReturnType<typeof usePublicBrandColors> }) {
  if (tone === 'success') {
    return <CheckCircle2 size={16} color={colors.greenDark} aria-hidden />
  }
  if (tone === 'warning') {
    return <AlertCircle size={16} color="#D97706" aria-hidden />
  }
  return <Circle size={16} color={colors.textMuted} aria-hidden />
}

export interface ApplicantDocumentChecklistNavProps {
  documents: ApplicantDocumentItem[]
  activeDocumentId?: string
  onSelect: (documentId: string) => void
}

export function ApplicantDocumentChecklistNav({
  documents,
  activeDocumentId,
  onSelect,
}: ApplicantDocumentChecklistNavProps) {
  const colors = usePublicBrandColors()

  return (
    <Box sx={{ px: 1.25, py: 1.25, bgcolor: colors.white }}>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {documents.map(doc => {
          const selected = activeDocumentId === doc.documentId
          const tone = docStatusTone(doc)
          const Icon = documentIcon(doc.documentId)

          return (
            <Box component="li" key={doc.documentId} sx={{ mb: 0.75 }}>
              <Box
                component="button"
                type="button"
                onClick={() => onSelect(doc.documentId)}
                aria-current={selected ? 'step' : undefined}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.25,
                  p: 1.25,
                  textAlign: 'left',
                  border: `1px solid ${selected ? colors.green : colors.border}`,
                  borderRadius: '10px',
                  bgcolor: selected ? colors.greenMuted : colors.surface,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, background-color 0.15s',
                  '&:hover': {
                    bgcolor: selected ? colors.greenMuted : colors.surfaceAlt,
                    borderColor: selected ? colors.green : colors.navyLight,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    bgcolor: selected ? colors.white : colors.surfaceAlt,
                    border: `1px solid ${colors.borderSoft}`,
                    color: colors.navy,
                  }}
                >
                  <Icon size={18} strokeWidth={2} aria-hidden />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 0.75,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: colors.navy,
                        lineHeight: 1.3,
                        pr: 0.5,
                      }}
                    >
                      {doc.name}
                    </Typography>
                    <StatusIcon tone={tone} colors={colors} />
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color:
                        tone === 'success'
                          ? colors.greenDark
                          : tone === 'warning'
                            ? '#B45309'
                            : colors.textMuted,
                      mt: 0.25,
                    }}
                  >
                    {documentStatusLabel(doc)}
                  </Typography>

                  {!doc.required ? (
                    <Typography
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: colors.textMuted,
                        mt: 0.5,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Optional
                    </Typography>
                  ) : null}
                </Box>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
