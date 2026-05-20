import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Box, IconButton, Tooltip, Divider, Typography, useTheme,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import CodeIcon from '@mui/icons-material/Code'
import LinkIcon from '@mui/icons-material/Link'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import { tokens } from '../../../tokens'

export type ToolbarItem =
  | 'bold' | 'italic' | 'underline' | 'strike'
  | 'h1' | 'h2' | 'h3'
  | 'bulletList' | 'orderedList'
  | 'blockquote' | 'codeBlock'
  | 'link' | 'undo' | 'redo'
  | 'divider'

export interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
  maxHeight?: number
  disabled?: boolean
  error?: boolean
  helperText?: string
  label?: string
  toolbar?: ToolbarItem[]
}

const DEFAULT_TOOLBAR: ToolbarItem[] = [
  'bold', 'italic', 'underline', 'strike',
  'divider',
  'h1', 'h2', 'h3',
  'divider',
  'bulletList', 'orderedList', 'blockquote', 'codeBlock',
  'divider',
  'link', 'undo', 'redo',
]

function ToolbarButton({
  title,
  active,
  disabled,
  onClick,
  children,
}: {
  title: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  const theme = useTheme()
  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          size="small"
          disabled={disabled}
          onClick={onClick}
          sx={{
            borderRadius: 0.5,
            p: 0.5,
            color: active ? 'primary.main' : 'text.secondary',
            bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : undefined,
            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  )
}

function H1Icon() { return <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1, px: 0.25 }}>H1</Typography> }
function H2Icon() { return <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1, px: 0.25 }}>H2</Typography> }
function H3Icon() { return <Typography sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1, px: 0.25 }}>H3</Typography> }

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  minHeight = 200,
  maxHeight,
  disabled = false,
  error = false,
  helperText,
  label,
  toolbar = DEFAULT_TOOLBAR,
}: RichTextEditorProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Sync value when changed externally (e.g. reset)
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const borderColor = error
    ? theme.palette.error.main
    : theme.palette.divider

  const renderToolbarItem = (item: ToolbarItem, index: number) => {
    if (item === 'divider') {
      return <Divider key={`div-${index}`} orientation="vertical" flexItem sx={{ mx: 0.25 }} />
    }

    if (!editor) return null

    const map: Record<Exclude<ToolbarItem, 'divider'>, { title: string; icon: React.ReactNode; active: boolean; action: () => void }> = {
      bold: {
        title: 'Bold (⌘B)',
        icon: <FormatBoldIcon fontSize="small" />,
        active: editor.isActive('bold'),
        action: () => editor.chain().focus().toggleBold().run(),
      },
      italic: {
        title: 'Italic (⌘I)',
        icon: <FormatItalicIcon fontSize="small" />,
        active: editor.isActive('italic'),
        action: () => editor.chain().focus().toggleItalic().run(),
      },
      underline: {
        title: 'Underline (⌘U)',
        icon: <FormatUnderlinedIcon fontSize="small" />,
        active: editor.isActive('underline'),
        action: () => editor.chain().focus().toggleUnderline().run(),
      },
      strike: {
        title: 'Strikethrough',
        icon: <StrikethroughSIcon fontSize="small" />,
        active: editor.isActive('strike'),
        action: () => editor.chain().focus().toggleStrike().run(),
      },
      h1: {
        title: 'Heading 1',
        icon: <H1Icon />,
        active: editor.isActive('heading', { level: 1 }),
        action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      h2: {
        title: 'Heading 2',
        icon: <H2Icon />,
        active: editor.isActive('heading', { level: 2 }),
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      h3: {
        title: 'Heading 3',
        icon: <H3Icon />,
        active: editor.isActive('heading', { level: 3 }),
        action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      bulletList: {
        title: 'Bullet list',
        icon: <FormatListBulletedIcon fontSize="small" />,
        active: editor.isActive('bulletList'),
        action: () => editor.chain().focus().toggleBulletList().run(),
      },
      orderedList: {
        title: 'Ordered list',
        icon: <FormatListNumberedIcon fontSize="small" />,
        active: editor.isActive('orderedList'),
        action: () => editor.chain().focus().toggleOrderedList().run(),
      },
      blockquote: {
        title: 'Blockquote',
        icon: <FormatQuoteIcon fontSize="small" />,
        active: editor.isActive('blockquote'),
        action: () => editor.chain().focus().toggleBlockquote().run(),
      },
      codeBlock: {
        title: 'Code block',
        icon: <CodeIcon fontSize="small" />,
        active: editor.isActive('codeBlock'),
        action: () => editor.chain().focus().toggleCodeBlock().run(),
      },
      link: {
        title: 'Link',
        icon: <LinkIcon fontSize="small" />,
        active: editor.isActive('link'),
        action: () => {
          const prev = editor.getAttributes('link').href as string ?? ''
          const url = window.prompt('URL', prev)
          if (url === null) return
          if (url === '') { editor.chain().focus().unsetLink().run(); return }
          editor.chain().focus().setLink({ href: url }).run()
        },
      },
      undo: {
        title: 'Undo (⌘Z)',
        icon: <UndoIcon fontSize="small" />,
        active: false,
        action: () => editor.chain().focus().undo().run(),
      },
      redo: {
        title: 'Redo (⌘⇧Z)',
        icon: <RedoIcon fontSize="small" />,
        active: false,
        action: () => editor.chain().focus().redo().run(),
      },
    }

    const btn = map[item]
    return (
      <ToolbarButton key={item} title={btn.title} active={btn.active} onClick={btn.action} disabled={disabled}>
        {btn.icon}
      </ToolbarButton>
    )
  }

  return (
    <Box>
      {label && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 0.5,
            color: error ? 'error.main' : 'text.secondary',
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      )}
      <Box
        sx={{
          border: '1px solid',
          borderColor,
          borderRadius: tokens.borderRadius.md,
          overflow: 'hidden',
          opacity: disabled ? 0.6 : 1,
          '&:focus-within': {
            borderColor: error ? 'error.main' : 'primary.main',
            borderWidth: 2,
          },
        }}
      >
        {/* Toolbar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 0.25,
            p: 0.75,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: isDark ? alpha(theme.palette.common.white, 0.02) : alpha(theme.palette.text.primary, 0.02),
          }}
        >
          {toolbar.map(renderToolbarItem)}
        </Box>

        {/* Editor content */}
        <Box
          sx={{
            minHeight,
            maxHeight,
            overflowY: maxHeight ? 'auto' : undefined,
            px: 1.75,
            py: 1.5,
            fontSize: tokens.fontSize.base,
            fontFamily: theme.typography.fontFamily,
            color: 'text.primary',
            bgcolor: 'transparent',
            // TipTap editor styles
            '& .ProseMirror': {
              outline: 'none',
              minHeight,
              '& p.is-editor-empty:first-of-type::before': {
                content: 'attr(data-placeholder)',
                color: theme.palette.text.disabled,
                pointerEvents: 'none',
                float: 'left',
                height: 0,
              },
              '& h1': { fontSize: '1.5em', fontWeight: 700, mt: 1, mb: 0.5 },
              '& h2': { fontSize: '1.25em', fontWeight: 700, mt: 1, mb: 0.5 },
              '& h3': { fontSize: '1.1em', fontWeight: 700, mt: 1, mb: 0.5 },
              '& ul, & ol': { pl: 3 },
              '& blockquote': {
                borderLeft: `3px solid ${theme.palette.divider}`,
                pl: 2,
                color: theme.palette.text.secondary,
                my: 1,
              },
              '& code': {
                fontFamily: 'monospace',
                fontSize: '0.875em',
                bgcolor: alpha(theme.palette.text.primary, 0.06),
                px: 0.5,
                borderRadius: 0.5,
              },
              '& pre': {
                bgcolor: isDark ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.text.primary, 0.04),
                borderRadius: 1,
                p: 1.5,
                overflow: 'auto',
                '& code': { bgcolor: 'transparent', p: 0 },
              },
              '& a': { color: theme.palette.primary.main, cursor: 'pointer' },
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>
      {helperText && (
        <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: error ? 'error.main' : 'text.secondary' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  )
}
