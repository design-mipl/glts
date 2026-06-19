import { Stack, Typography } from '@mui/material'
import { BaseCard, Button } from '@/design-system/UIComponents'
import { quotationService } from '@/shared/services/quotationService'
import type { QuotationRecord } from '@/shared/types/quotation'

const ACTOR = 'Admin User'

export function DocumentsTab({ quotation, onReload }: { quotation: QuotationRecord; onReload: () => void }) {
  const handleUpload = () => {
    quotationService.addAttachment(quotation.id, `quotation-support-${Date.now()}.pdf`, ACTOR)
    onReload()
  }

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="flex-end">
        <Button label="Upload Supporting Document" onClick={handleUpload} />
      </Stack>
      {quotation.attachments.length === 0 ? (
        <BaseCard sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No supporting documents uploaded yet.
          </Typography>
        </BaseCard>
      ) : (
        quotation.attachments.map((item) => (
          <BaseCard key={item.id} sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack spacing={0.5}>
                <Typography variant="subtitle2">{item.fileName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.fileType.toUpperCase()} · {item.fileSizeKb} KB · {item.uploadedBy}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button label="Download" variant="outlined" />
                <Button
                  label="Delete"
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    quotationService.removeAttachment(quotation.id, item.id, ACTOR)
                    onReload()
                  }}
                />
              </Stack>
            </Stack>
          </BaseCard>
        ))
      )}
    </Stack>
  )
}
