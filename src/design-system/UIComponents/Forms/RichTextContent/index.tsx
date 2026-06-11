import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import { containsHtml } from '@/shared/utils/richTextUtils'
import { getRichTextProseSx } from '../RichTextEditor/richTextProseStyles'

export interface RichTextContentProps {
  content: string
  sx?: SxProps<Theme>
}

export default function RichTextContent({ content, sx }: RichTextContentProps) {
  const theme = useTheme()

  if (!content.trim()) return null

  if (!containsHtml(content)) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, ...sx }}>
        {content}
      </Typography>
    )
  }

  return (
    <Box
      className="rich-text-content"
      sx={[
        getRichTextProseSx(theme),
        { fontSize: 13, color: 'text.secondary' },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
