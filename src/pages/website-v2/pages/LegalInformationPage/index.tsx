import {
  Box,
  Breadcrumbs,
  FormControl,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  type SelectChangeEvent,
} from '@mui/material'
import {
  BadgeCheck,
  ChevronRight,
  FileText,
  Lock,
  RotateCcw,
  Shield,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { PublicContainer } from '../../components/PublicContainer'
import { publicFonts, publicLayout, publicShadows, usePublicBrandColors } from '../../theme/publicSiteTokens'
import { websiteSectionPadding } from '../../theme/websiteDesignSystem'
import {
  legalDocuments,
  legacyNoticeDocumentIds,
  primaryLegalDocumentIds,
  type LegalBlock,
  type LegalDocumentId,
} from './legalDocuments'

const legalIcons: Record<LegalDocumentId, LucideIcon> = {
  terms: FileText,
  privacy: Shield,
  'refund-cancellation': RotateCcw,
  security: Lock,
  compliance: BadgeCheck,
  disclaimer: FileText,
  'site-content-disclaimer': FileText,
}

function LegalHero() {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      aria-labelledby="legal-information-title"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: colors.navy,
        background: `radial-gradient(ellipse at 82% 40%, rgba(115, 192, 100, 0.22), transparent 34%), ${colors.heroGradient}`,
        color: colors.white,
      }}
    >
      <PublicContainer
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: { xs: 206, sm: 220 },
          display: 'flex',
          alignItems: 'center',
          py: { xs: 4, md: 4.5 },
        }}
      >
        <Box sx={{ maxWidth: 760, pr: { sm: 18, md: 22 } }}>
          <Breadcrumbs
            component="nav"
            aria-label="Breadcrumb"
            separator={<ChevronRight size={14} aria-hidden="true" />}
            sx={{
              mb: 1.5,
              color: 'rgba(255,255,255,0.76)',
              '& .MuiBreadcrumbs-separator': { mx: 0.75, color: 'rgba(255,255,255,0.5)' },
            }}
          >
            <Link
              component={RouterLink}
              to="/"
              underline="hover"
              sx={{ color: 'inherit', fontSize: 13, '&:focus-visible': { outline: '2px solid #fff' } }}
            >
              Home
            </Link>
            <Typography aria-current="page" sx={{ color: 'inherit', fontSize: 13 }}>
              Legal Information
            </Typography>
          </Breadcrumbs>
          <Typography
            id="legal-information-title"
            component="h1"
            sx={{
              fontFamily: publicFonts.display,
              fontSize: { xs: 30, sm: 34, md: 38 },
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              mb: 1.25,
            }}
          >
            Legal Information
          </Typography>
          <Typography sx={{ maxWidth: 660, color: 'rgba(255,255,255,0.82)', fontSize: { xs: 15, sm: 16 }, lineHeight: 1.65 }}>
            Policies and information governing the use of GreenLight Visa Solutions and our services.
          </Typography>
        </Box>

        <Box
          component="img"
          src="/images/how-it-works-passport.png"
          alt=""
          aria-hidden="true"
          sx={{
            display: { xs: 'none', sm: 'block' },
            position: 'absolute',
            right: { sm: 4, md: 10 },
            top: '50%',
            width: { sm: 90, md: 116 },
            height: { sm: 126, md: 164 },
            objectFit: 'cover',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.35)',
            boxShadow: '0 16px 36px rgba(0,0,0,0.3)',
            transform: 'translateY(-50%) rotate(5deg)',
          }}
        />
      </PublicContainer>
    </Box>
  )
}

function NavigationItem({
  documentId,
  active,
}: {
  documentId: LegalDocumentId
  active: boolean
}) {
  const colors = usePublicBrandColors()
  const document = legalDocuments[documentId]
  const Icon = legalIcons[documentId]

  return (
    <Link
      component={RouterLink}
      to={document.path}
      underline="none"
      aria-current={active ? 'page' : undefined}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        minHeight: 54,
        px: 1.5,
        py: 1.25,
        borderRadius: '14px',
        color: active ? colors.navy : colors.textSecondary,
        bgcolor: active ? colors.greenMuted : 'transparent',
        border: `1px solid ${active ? 'rgba(115, 192, 100, 0.28)' : 'transparent'}`,
        fontSize: 14,
        fontWeight: active ? 700 : 600,
        lineHeight: 1.35,
        transition: 'background-color 160ms ease, border-color 160ms ease, color 160ms ease',
        '&:hover': {
          color: colors.navy,
          bgcolor: active ? colors.greenMuted : colors.surface,
        },
        '&:focus-visible': {
          outline: `2px solid ${colors.navy}`,
          outlineOffset: 2,
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          flex: '0 0 34px',
          width: 34,
          height: 34,
          borderRadius: '11px',
          bgcolor: active ? 'rgba(115, 192, 100, 0.16)' : colors.surfaceAlt,
          color: active ? colors.greenDark : colors.textSecondary,
        }}
      >
        <Icon size={18} aria-hidden="true" />
      </Box>
      <Box component="span" sx={{ flex: 1, minWidth: 0 }}>
        {document.title}
      </Box>
      <ChevronRight size={16} aria-hidden="true" />
    </Link>
  )
}

function LegalNavigation({ activeId }: { activeId: LegalDocumentId }) {
  const colors = usePublicBrandColors()

  return (
    <Box component="aside" aria-label="Legal document navigation" sx={{ display: { xs: 'none', md: 'block' }, alignSelf: 'start', position: 'sticky', top: `${publicLayout.navHeight + 16}px`, zIndex: 1 }}>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: '18px',
          borderColor: colors.border,
          boxShadow: publicShadows.card,
          bgcolor: colors.white,
        }}
      >
        <Typography sx={{ px: 1.5, pt: 0.5, pb: 1.25, fontSize: 12, fontWeight: 800, color: colors.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Legal documents
        </Typography>
        <Stack component="nav" aria-label="Primary legal documents" spacing={0.5}>
          {primaryLegalDocumentIds.map(id => (
            <NavigationItem key={id} documentId={id} active={activeId === id} />
          ))}
        </Stack>
        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${colors.borderSoft}` }}>
          <Typography sx={{ px: 1.5, pb: 1, fontSize: 12, fontWeight: 800, color: colors.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Additional notices
          </Typography>
          <Stack component="nav" aria-label="Additional legal notices" spacing={0.5}>
            {legacyNoticeDocumentIds.map(id => (
              <NavigationItem key={id} documentId={id} active={activeId === id} />
            ))}
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}

function MobileLegalNavigation({ activeId }: { activeId: LegalDocumentId }) {
  const navigate = useNavigate()
  const colors = usePublicBrandColors()
  const handleChange = (event: SelectChangeEvent<LegalDocumentId>) => {
    navigate(legalDocuments[event.target.value as LegalDocumentId].path)
  }

  return (
    <FormControl fullWidth size="small" sx={{ display: { xs: 'flex', md: 'none' }, mb: 2.5 }}>
      <Select
        id="legal-document-select"
        value={activeId}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'Legal document' }}
        sx={{
          bgcolor: colors.white,
          borderRadius: '12px',
          '&:focus-visible': { outline: `2px solid ${colors.navy}` },
        }}
      >
        {primaryLegalDocumentIds.map(id => (
          <MenuItem key={id} value={id}>{legalDocuments[id].title}</MenuItem>
        ))}
        {legacyNoticeDocumentIds.map(id => (
          <MenuItem key={id} value={id}>{legalDocuments[id].title}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

function LegalBlockView({ block, first }: { block: LegalBlock; first: boolean }) {
  const colors = usePublicBrandColors()

  if (block.type === 'heading') {
    return (
      <Typography
        component="h3"
        sx={{
          mt: first ? 0 : 3,
          mb: 0.75,
          fontFamily: publicFonts.heading,
          color: colors.navy,
          fontWeight: 750,
          fontSize: { xs: 17, md: 18 },
          lineHeight: 1.45,
        }}
      >
        {block.text}
      </Typography>
    )
  }

  return (
    <Typography
      component="p"
      sx={{
        m: 0,
        color: colors.textSecondary,
        fontSize: { xs: 15, md: 16 },
        lineHeight: { xs: 1.8, md: 1.9 },
        overflowWrap: 'anywhere',
        '& strong': { color: colors.navy, fontWeight: 800 },
      }}
    >
      {block.type === 'important' ? (
        <>
          <strong>IMPORTANT:</strong>{block.text.slice('IMPORTANT:'.length)}
        </>
      ) : block.text}
    </Typography>
  )
}

export function LegalInformationPage() {
  const colors = usePublicBrandColors()
  const contentRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const normalizedPath = pathname.replace(/\/+$/, '')
  const documentId =
    (Object.values(legalDocuments).find(document => document.path === normalizedPath)?.id as
      | LegalDocumentId
      | undefined) ?? 'terms'
  const document = legalDocuments[documentId]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    if (contentRef.current) contentRef.current.scrollTop = 0
  }, [pathname])

  return (
    <>
      <LegalHero />
      <Box component="section" aria-label={document.title} sx={{ bgcolor: colors.surface, py: websiteSectionPadding.compact }}>
        <PublicContainer sx={{ maxWidth: { xs: '100%', md: 1440 } }}>
          <MobileLegalNavigation activeId={documentId} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(245px, 300px) minmax(0, 1fr)' },
              gap: { xs: 2, md: 3, lg: 4 },
              alignItems: 'start',
            }}
          >
            <LegalNavigation activeId={documentId} />
            <Paper
              component="article"
              aria-labelledby="legal-document-title"
              variant="outlined"
              sx={{
                minWidth: 0,
                height: { xs: 'auto', md: 680 },
                display: 'flex',
                flexDirection: 'column',
                overflow: { xs: 'visible', md: 'hidden' },
                borderRadius: { xs: '16px', md: '20px' },
                borderColor: colors.border,
                bgcolor: colors.white,
                boxShadow: publicShadows.card,
              }}
            >
              <Box
                sx={{
                  flex: '0 0 auto',
                  px: 0,
                  borderBottom: `1px solid ${colors.borderSoft}`,
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    mx: 'auto',
                    px: { xs: 2.5, sm: 3.5, md: 4, lg: 4.5 },
                    pt: { xs: 2.5, sm: 3.5, md: 4, lg: 4.5 },
                    pb: 2.5,
                    textAlign: 'left',
                  }}
                >
                  {document.eyebrow && (
                    <Typography sx={{ mb: 1, color: colors.greenDark, fontSize: 12, fontWeight: 800, letterSpacing: '0.09em' }}>
                      {document.eyebrow}
                    </Typography>
                  )}
                  <Typography
                    id="legal-document-title"
                    component="h2"
                    sx={{
                      color: colors.navy,
                      fontFamily: publicFonts.display,
                      fontSize: { xs: 23, sm: 26, md: 30 },
                      fontWeight: 700,
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {document.title}
                  </Typography>
                </Box>
              </Box>
              <Box
                ref={contentRef}
                role="region"
                aria-label={`${document.title} content`}
                tabIndex={0}
                sx={{
                  flex: { xs: '0 0 auto', md: '1 1 auto' },
                  minHeight: { xs: 'auto', md: 0 },
                  overflowY: { xs: 'visible', md: 'auto' },
                  overflowX: 'hidden',
                  overscrollBehavior: 'contain',
                  px: 0,
                  scrollbarWidth: 'thin',
                  scrollbarColor: `${colors.greenDark} ${colors.surfaceAlt}`,
                  '&::-webkit-scrollbar': { width: 8 },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: colors.surfaceAlt,
                    borderRadius: 999,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: colors.greenDark,
                    border: `2px solid ${colors.surfaceAlt}`,
                    borderRadius: 999,
                  },
                  '&::-webkit-scrollbar-thumb:hover': { backgroundColor: colors.greenBright },
                  '&:focus-visible': {
                    outline: `2px solid ${colors.greenDark}`,
                    outlineOffset: -2,
                  },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    mx: 'auto',
                    px: { xs: 2.5, sm: 3.5, md: 4, lg: 4.5 },
                    pt: { xs: 2.5, md: 3 },
                    pb: { xs: 2.5, md: 3.5 },
                    textAlign: 'left',
                  }}
                >
                  <Stack spacing={2} sx={{ width: '100%', textAlign: 'left' }}>
                    {document.blocks.map((block, index) => (
                      <LegalBlockView key={`${block.type}-${index}`} block={block} first={index === 0} />
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Paper>
          </Box>
        </PublicContainer>
      </Box>
    </>
  )
}
