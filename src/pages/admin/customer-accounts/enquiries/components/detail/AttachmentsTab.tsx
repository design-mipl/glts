import { Stack, Typography } from '@mui/material'
import { BaseCard, Button } from '@/design-system/UIComponents'
import type { EnquiryRecord } from '@/shared/types/enquiry'

export function AttachmentsTab({
  enquiry,
  onUpload,
}: {
  enquiry: EnquiryRecord
  onUpload: () => void
}) {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="flex-end">
        <Button label="Upload Attachment" onClick={onUpload} />
      </Stack>
      {enquiry.attachments.length === 0 ? (
        <BaseCard sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No attachments uploaded yet.
          </Typography>
        </BaseCard>
      ) : (
        enquiry.attachments.map((item) => (
          <BaseCard key={item.id} sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack spacing={0.5}>
                <Typography variant="subtitle2">{item.fileName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Version {item.version} · {item.fileType.toUpperCase()} · {item.fileSizeKb} KB
                </Typography>
              </Stack>
              <Button label="Download" variant="outlined" />
            </Stack>
          </BaseCard>
        ))
      )}
    </Stack>
  )
}
