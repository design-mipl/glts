import { Box, Card, Stack, Typography } from '@mui/material'
import { Download, Eye, FileText } from 'lucide-react'
import { IconButton, useToast } from '@/design-system/UIComponents'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'
import {
  CustomerStatusChip,
  getCustomerStatusTone,
} from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { CustomerDetailSection } from '@/pages/customer/features/shared/components/detail'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { AgreementDocument } from '../../types/accountWorkspace'

export interface AgreementDocumentsSectionProps {
  documents: AgreementDocument[]
}

export function AgreementDocumentsSection({ documents }: AgreementDocumentsSectionProps) {
  const colors = usePublicBrandColors()
  const { showToast } = useToast()

  const handlePreview = (doc: AgreementDocument) => {
    showToast({ title: 'Preview opened', description: doc.fileName ?? doc.label, variant: 'info' })
  }

  const handleDownload = (doc: AgreementDocument) => {
    showToast({ title: 'Download started', description: doc.fileName ?? doc.label, variant: 'success' })
  }

  return (
    <CustomerDetailSection title="Agreement documents">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          gap: 1.5,
          overflowX: 'auto',
          pb: 0.25,
        }}
      >
        {documents.map(doc => {
          const isAvailable = doc.status === 'available'

          return (
            <Card
              key={doc.id}
              elevation={0}
              sx={{
                flex: '1 1 0',
                minWidth: 148,
                maxWidth: 220,
                p: 1.25,
                border: `${BORDER_WIDTH.thin} solid`,
                borderColor: 'divider',
                borderRadius: BORDER_RADIUS.lg,
                boxShadow: SHADOWS.sm,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Stack direction="row" spacing={1.25} alignItems="flex-start">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: BORDER_RADIUS.md,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: colors.surfaceAlt,
                    color: colors.navy,
                  }}
                >
                  <FileText size={18} strokeWidth={2} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35 }} noWrap title={doc.label}>
                    {doc.label}
                  </Typography>
                  {doc.fileName ? (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.25 }}
                      noWrap
                      title={doc.fileName}
                    >
                      {doc.fileName}
                    </Typography>
                  ) : null}
                </Box>
              </Stack>

              <CustomerStatusChip
                label={isAvailable ? 'Available' : 'Pending'}
                tone={getCustomerStatusTone(isAvailable ? 'active' : 'pending')}
              />

              <Stack direction="row" spacing={0.5} justifyContent="flex-end" sx={{ mt: 'auto' }}>
                <IconButton
                  variant="outlined"
                  size="sm"
                  tooltip="Preview"
                  icon={<Eye size={14} />}
                  onClick={() => handlePreview(doc)}
                  disabled={!isAvailable}
                />
                <IconButton
                  variant="outlined"
                  size="sm"
                  tooltip="Download"
                  icon={<Download size={14} />}
                  onClick={() => handleDownload(doc)}
                  disabled={!isAvailable}
                />
              </Stack>
            </Card>
          )
        })}
      </Box>
    </CustomerDetailSection>
  )
}
