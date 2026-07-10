import { Box, Stack, Typography } from '@mui/material'
import { Download, Eye, FileSpreadsheet, FileText } from 'lucide-react'
import { Button, useToast } from '@/design-system/UIComponents'
import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'
import { publicShadows, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { PORTAL_USER_GUIDES, type PortalUserGuideFormat } from '../data/portalUserGuides'

function formatGuideDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function GuideFormatIcon({ format }: { format: PortalUserGuideFormat }) {
  const isPdf = format === 'pdf'
  return (
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.lg,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        bgcolor: isPdf ? 'rgba(220, 38, 38, 0.08)' : 'rgba(37, 99, 235, 0.08)',
        color: isPdf ? '#DC2626' : '#2563EB',
        border: `1px solid ${isPdf ? 'rgba(220, 38, 38, 0.2)' : 'rgba(37, 99, 235, 0.2)'}`,
      }}
    >
      {isPdf ? <FileText size={22} strokeWidth={1.75} /> : <FileSpreadsheet size={22} strokeWidth={1.75} />}
    </Box>
  )
}

export function HelpSupportGuidesSection() {
  const colors = usePublicBrandColors()
  const { showToast } = useToast()

  const handlePreview = (name: string) => {
    showToast({
      title: 'Opening preview',
      description: `${name} preview will open in a new tab when connected to document storage.`,
      variant: 'info',
    })
  }

  const handleDownload = (name: string) => {
    showToast({
      title: 'Download started',
      description: `${name} is being prepared for download.`,
      variant: 'success',
    })
  }

  return (
    <Stack spacing={1.5}>
        {PORTAL_USER_GUIDES.map(guide => (
          <Box
            key={guide.id}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2,
              p: 2,
              border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
              borderRadius: BORDER_RADIUS.lg,
              bgcolor: colors.white,
              boxShadow: publicShadows.card,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
              <GuideFormatIcon format={guide.format} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.navy }}>
                  {guide.name}
                </Typography>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
                  <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
                    v{guide.version}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
                    Updated {formatGuideDate(guide.updatedDate)}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
                    {guide.fileSize}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: colors.textSecondary,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {guide.format}
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
              <Button
                type="button"
                variant="outlined"
                startIcon={<Eye size={14} />}
                onClick={() => handlePreview(guide.name)}
              >
                Preview
              </Button>
              <Button
                type="button"
                startIcon={<Download size={14} />}
                onClick={() => handleDownload(guide.name)}
              >
                Download
              </Button>
            </Stack>
          </Box>
        ))}
    </Stack>
  )
}
