import { Box, Stack, Typography } from '@mui/material'
import { FileText } from 'lucide-react'

interface AssignmentOperationalAttachmentsProps {
  attachmentNames: string[]
}

/** Operational attachments uploaded during Assignment & Priority handling. */
export function AssignmentOperationalAttachments({
  attachmentNames,
}: AssignmentOperationalAttachmentsProps) {
  if (attachmentNames.length === 0) return null

  return (
    <Stack spacing={0.75}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 11 }}>
        Operational attachments
      </Typography>
      {attachmentNames.map(fileName => (
        <Stack
          key={fileName}
          direction="row"
          spacing={1}
          alignItems="flex-start"
          sx={{
            px: 1.25,
            py: 1,
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ color: 'text.secondary', display: 'flex', pt: 0.15 }}>
            <FileText size={16} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
              Operational attachment
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 12 }} noWrap title={fileName}>
              {fileName}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  )
}
