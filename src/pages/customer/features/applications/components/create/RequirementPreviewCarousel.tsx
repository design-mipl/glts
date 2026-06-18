import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Box, Typography, Card, Stack, Link, Divider, keyframes } from '@mui/material'
import { ArrowLeft, FileSearch, FileText } from 'lucide-react'
import { RichTextContent } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { DOCUMENT_OWNER_TYPE_LABELS } from '@/shared/constants/documentOwnerType'
import type { DocumentOwnerType, RequirementPreviewCard } from '@/shared/types/countryMaster'
import { CustomerTabs } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { DocumentRequirementTags } from '../DocumentRequirementTags'

interface RequirementPreviewCarouselProps {
  cards: RequirementPreviewCard[]
  requiresJurisdictionSelection?: boolean
}

const PLACEHOLDER_TAB_LABELS = ['Seafarer', 'Company', 'Shipping Agent', 'GLTS']

const skeletonPulse = keyframes`
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.65; }
`

function tabLabel(card: RequirementPreviewCard): string {
  if (card.ownerType) {
    return DOCUMENT_OWNER_TYPE_LABELS[card.ownerType as DocumentOwnerType]
  }
  if (card.variant === 'glts') return 'GLTS'
  const labels: Record<RequirementPreviewCard['variant'], string> = {
    crew: 'Seafarer',
    shipping: 'Company',
    embassy: 'Shipping Agent',
    glts: 'GLTS',
  }
  return labels[card.variant] ?? card.title
}

export function RequirementPreviewCarousel({
  cards,
  requiresJurisdictionSelection = true,
}: RequirementPreviewCarouselProps) {
  const colors = usePublicBrandColors()
  const [activeTab, setActiveTab] = useState(cards[0]?.id ?? '')

  useEffect(() => {
    if (cards.length === 0) {
      setActiveTab('')
      return
    }
    if (!cards.some((card) => card.id === activeTab)) {
      setActiveTab(cards[0].id)
    }
  }, [cards, activeTab])

  const tabItems = useMemo(
    () =>
      cards.map((card) => ({
        value: card.id,
        label: tabLabel(card),
      })),
    [cards],
  )

  if (cards.length === 0) {
    return (
      <RequirementPreviewEmptyState
        colors={colors}
        requiresJurisdictionSelection={requiresJurisdictionSelection}
      />
    )
  }

  const card = cards.find((entry) => entry.id === activeTab) ?? cards[0]

  return (
    <RequirementPreviewSectionShell colors={colors}>
      <CustomerTabs value={activeTab} onChange={setActiveTab} items={tabItems} />
      <RequirementPreviewContentShell
        colors={colors}
        minHeight={card.variant === 'glts' ? 0 : 220}
      >
        <RequirementPreviewCardPanel card={card} colors={colors} />
      </RequirementPreviewContentShell>
    </RequirementPreviewSectionShell>
  )
}

function RequirementPreviewContentShell({
  colors,
  children,
  minHeight = 220,
  dashed = false,
}: {
  colors: ReturnType<typeof usePublicBrandColors>
  children: ReactNode
  minHeight?: number
  dashed?: boolean
}) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight,
        mt: 1,
        overflow: 'auto',
        borderRadius: '10px',
        border: `1px ${dashed ? 'dashed' : 'solid'} ${colors.border}`,
        bgcolor: colors.white,
        px: { xs: 1.5, md: 2 },
        py: { xs: 1.25, md: 1.5 },
      }}
    >
      {children}
    </Box>
  )
}

function RequirementPreviewSectionShell({
  colors,
  children,
}: {
  colors: ReturnType<typeof usePublicBrandColors>
  children: ReactNode
}) {
  return (
    <Card
      sx={{
        p: { xs: 1.25, md: 1.5 },
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        bgcolor: colors.surface,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: colors.textSecondary,
          textTransform: 'uppercase',
          mb: 0.75,
        }}
      >
        Document requirements
      </Typography>
      <Divider sx={{ borderColor: colors.border, mb: 1 }} />
      {children}
    </Card>
  )
}

function RequirementPreviewEmptyState({
  colors,
  requiresJurisdictionSelection = true,
}: {
  colors: ReturnType<typeof usePublicBrandColors>
  requiresJurisdictionSelection?: boolean
}) {
  return (
    <RequirementPreviewSectionShell colors={colors}>
      <Stack
        direction="row"
        spacing={2}
        flexWrap="wrap"
        useFlexGap
        sx={{
          mb: 1.5,
          pb: 1,
          borderBottom: `1px solid ${colors.border}`,
          opacity: 0.55,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {PLACEHOLDER_TAB_LABELS.map((label, index) => (
          <Typography
            key={label}
            sx={{
              fontSize: 13,
              fontWeight: index === 0 ? 700 : 500,
              color: index === 0 ? colors.navy : colors.textMuted,
              borderBottom: index === 0 ? `2px solid ${colors.navy}` : '2px solid transparent',
              pb: 0.75,
            }}
          >
            {label}
          </Typography>
        ))}
      </Stack>

      <RequirementPreviewContentShell colors={colors} minHeight={280} dashed>
        <Stack alignItems="center" textAlign="center" spacing={1.25} sx={{ py: 2.5, px: 1 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              display: 'grid',
              placeItems: 'center',
              bgcolor: colors.greenMuted,
              color: colors.greenDark,
            }}
          >
            <FileSearch size={24} />
          </Box>
          <Typography sx={{ fontSize: 15, fontWeight: 800, color: colors.navy, lineHeight: 1.35 }}>
            Document requirements preview
          </Typography>
          <Typography sx={{ fontSize: 12, color: colors.textSecondary, maxWidth: 300, lineHeight: 1.5 }}>
            {requiresJurisdictionSelection
              ? 'Choose an issued passport state on the left to load jurisdiction-specific documents, samples, and GLTS scope.'
              : 'Document requirements for this visa type will appear here once configured in country master.'}
          </Typography>
          {requiresJurisdictionSelection ? (
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{
                mt: 0.5,
                px: 1.25,
                py: 0.75,
                borderRadius: '999px',
                bgcolor: colors.surfaceAlt,
                border: `1px solid ${colors.border}`,
              }}
            >
              <ArrowLeft size={14} color={colors.textMuted} />
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: colors.textMuted }}>
                Start with passport state
              </Typography>
            </Stack>
          ) : null}
        </Stack>

        <Stack spacing={1} sx={{ px: 0.5, pb: 0.5, flex: 1 }}>
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                py: 1.25,
                px: 1.25,
                borderRadius: '10px',
                border: `1px dashed ${colors.border}`,
                bgcolor: colors.white,
                animation: `${skeletonPulse} 2.4s ease-in-out infinite`,
                animationDelay: `${index * 0.35}s`,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                <Box
                  sx={{
                    width: `${58 - index * 6}%`,
                    height: 10,
                    borderRadius: '4px',
                    bgcolor: colors.surfaceAlt,
                  }}
                />
                <Box sx={{ width: 52, height: 16, borderRadius: '999px', bgcolor: colors.surfaceAlt }} />
              </Stack>
              <Box sx={{ width: '92%', height: 8, borderRadius: '4px', bgcolor: colors.surfaceAlt, mb: 0.5 }} />
              <Box sx={{ width: '72%', height: 8, borderRadius: '4px', bgcolor: colors.surfaceAlt }} />
            </Box>
          ))}
        </Stack>
      </RequirementPreviewContentShell>
    </RequirementPreviewSectionShell>
  )
}

function RequirementPreviewCardPanel({
  card,
  colors,
}: {
  card: RequirementPreviewCard
  colors: ReturnType<typeof usePublicBrandColors>
}) {
  if (card.variant === 'glts' && card.gltsScopeHtml) {
    return <GltsScopeRichTextPanel content={card.gltsScopeHtml} colors={colors} />
  }

  return (
    <>
      {card.alertNote ? (
        <Typography sx={{ fontSize: 12, color: colors.textSecondary, mb: 1.5, lineHeight: 1.45, px: 1.5 }}>
          {card.alertNote}
        </Typography>
      ) : null}

      {card.documents ? (
        <Stack
          spacing={0}
          divider={<Divider sx={{ borderColor: colors.border }} />}
          sx={{ px: 1.5 }}
        >
          {card.documents.map((doc) => (
            <Stack key={doc.id} spacing={0.75} sx={{ py: 1.25 }}>
              <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap">
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.navy }}>{doc.name}</Typography>
                <DocumentRequirementTags
                  mandatory={doc.mandatory}
                  originalDocument={doc.originalDocument}
                />
              </Stack>

              {doc.description ? (
                <Box
                  sx={{
                    '& p, & li': { fontSize: 12, color: colors.textSecondary, m: 0, lineHeight: 1.45 },
                    '& ul, & ol': { m: 0, pl: 2.25 },
                  }}
                >
                  <RichTextContent content={doc.description} />
                </Box>
              ) : doc.remarks ? (
                <Typography sx={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.45 }}>
                  {doc.remarks}
                </Typography>
              ) : null}

              {doc.hasSample && doc.sampleDocumentName && doc.sampleDocumentUrl ? (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <FileText size={13} color={colors.textMuted} />
                  <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>Sample:</Typography>
                  <Link
                    href={doc.sampleDocumentUrl}
                    download={doc.sampleDocumentName}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ fontSize: 12, fontWeight: 500 }}
                  >
                    {doc.sampleDocumentName}
                  </Link>
                </Stack>
              ) : null}
            </Stack>
          ))}
        </Stack>
      ) : null}
    </>
  )
}

function GltsScopeRichTextPanel({
  content,
  colors,
}: {
  content: string
  colors: ReturnType<typeof usePublicBrandColors>
}) {
  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          px: 1.25,
          py: 1,
          borderRadius: '10px',
          bgcolor: colors.greenMuted,
          border: `1px solid ${colors.greenBright}33`,
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.greenDark, lineHeight: 1.4 }}>
          GLTS service scope for this jurisdiction
        </Typography>
      </Stack>

      <Box
        sx={{
          p: 1.5,
          borderRadius: '10px',
          border: `1px solid ${colors.border}`,
          bgcolor: colors.white,
          '& p': { fontSize: 13, color: colors.navy, m: 0, mb: 0.75, lineHeight: 1.45 },
          '& ul': { m: 0, pl: 2.5 },
          '& li': { fontSize: 13, color: colors.navy, lineHeight: 1.45 },
        }}
      >
        <RichTextContent content={content} />
      </Box>
    </Stack>
  )
}
