import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import LinkExtension from '@tiptap/extension-link'
import UnderlineExtension from '@tiptap/extension-underline'
import { Box, Divider, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, Code, Link, Undo, Redo } from 'lucide-react'
import {
  FORM_CONTROL,
  formControlBorderDefault,
  formControlFieldBackground,
} from '../../../formControl'
import IconButton from '../../Primitives/IconButton'
import { getRichTextProseSx } from './richTextProseStyles'

const TOOLBAR_ICON_SIZE = 14

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

function H1Icon() {
  return (
    <Typography sx={{ fontSize: TOOLBAR_ICON_SIZE, fontWeight: 700, lineHeight: 1 }}>
      H1
    </Typography>
  )
}
function H2Icon() {
  return (
    <Typography sx={{ fontSize: TOOLBAR_ICON_SIZE, fontWeight: 700, lineHeight: 1 }}>
      H2
    </Typography>
  )
}
function H3Icon() {
  return (
    <Typography sx={{ fontSize: TOOLBAR_ICON_SIZE, fontWeight: 700, lineHeight: 1 }}>
      H3
    </Typography>
  )
}

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

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      UnderlineExtension,
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
      }),
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

  const borderColor = error ? theme.palette.error.main : formControlBorderDefault(theme)

  const renderToolbarItem = (item: ToolbarItem, index: number) => {
    if (item === 'divider') {
      return (
        <Divider
          key={`div-${index}`}
          orientation="vertical"
          flexItem
          sx={{ mx: 0.25, my: 0.5, height: 20, alignSelf: 'center' }}
        />
      )
    }

    const map: Record<Exclude<ToolbarItem, 'divider'>, { title: string; icon: React.ReactNode; active: boolean; action: () => void }> = {
      bold: {
        title: 'Bold (⌘B)',
        icon: <Bold size={TOOLBAR_ICON_SIZE} strokeWidth={2} />,
        active: editor.isActive('bold'),
        action: () => editor.chain().focus().toggleBold().run(),
      },
      italic: {
        title: 'Italic (⌘I)',
        icon: <Italic size={TOOLBAR_ICON_SIZE} strokeWidth={2} />,
        active: editor.isActive('italic'),
        action: () => editor.chain().focus().toggleItalic().run(),
      },
      underline: {
        title: 'Underline (⌘U)',
        icon: <Underline size={TOOLBAR_ICON_SIZE} strokeWidth={2} />,
        active: editor.isActive('underline'),
        action: () => editor.chain().focus().toggleUnderline().run(),
      },
      strike: {
        title: 'Strikethrough',
        icon: <Strikethrough size={TOOLBAR_ICON_SIZE} strokeWidth={2} />,
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
        icon: <List size={TOOLBAR_ICON_SIZE} strokeWidth={2} />,
        active: editor.isActive('bulletList'),
        action: () => editor.chain().focus().toggleBulletList().run(),
      },
      orderedList: {
        title: 'Ordered list',
        icon: <ListOrdered size={TOOLBAR_ICON_SIZE} strokeWidth={2} />,
        active: editor.isActive('orderedList'),
        action: () => editor.chain().focus().toggleOrderedList().run(),
      },
      blockquote: {
        title: 'Blockquote',
        icon: <Quote size={TOOLBAR_ICON_SIZE} strokeWidth={2} />,
        active: editor.isActive('blockquote'),
        action: () => editor.chain().focus().toggleBlockquote().run(),
      },
      codeBlock: {
        title: 'Code block',
        icon: <Code size={TOOLBAR_ICON_SIZE} strokeWidth={2} />,
        active: editor.isActive('codeBlock'),
        action: () => editor.chain().focus().toggleCodeBlock().run(),
      },
      link: {
        title: 'Link',
        icon: <Link size={TOOLBAR_ICON_SIZE} strokeWidth={2} />,
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
        icon: <Undo size={TOOLBAR_ICON_SIZE} strokeWidth={2} />,
        active: false,
        action: () => editor.chain().focus().undo().run(),
      },
      redo: {
        title: 'Redo (⌘⇧Z)',
        icon: <Redo size={TOOLBAR_ICON_SIZE} strokeWidth={2} />,
        active: false,
        action: () => editor.chain().focus().redo().run(),
      },
    }

    const btn = map[item]
    return (
      <IconButton
        key={item}
        tooltip={btn.title}
        icon={btn.icon}
        size="sm"
        variant={btn.active ? 'soft' : 'default'}
        color={btn.active ? 'primary' : 'default'}
        onClick={btn.action}
        disabled={disabled}
      />
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
          border: `${FORM_CONTROL.borderWidth} solid`,
          borderColor,
          borderRadius: FORM_CONTROL.borderRadius,
          overflow: 'hidden',
          bgcolor: formControlFieldBackground(theme),
          opacity: disabled ? 0.6 : 1,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:focus-within': {
            borderColor: error ? 'error.main' : 'primary.main',
            boxShadow: error
              ? `0 0 0 2px ${alpha(theme.palette.error.main, 0.1)}`
              : `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
          },
        }}
      >
        {/* Toolbar */}
        {editor ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 0.5,
              px: 1,
              py: 0.75,
              minHeight: 40,
              borderBottom: '1px solid',
              borderColor: alpha(theme.palette.text.primary, 0.1),
              bgcolor: alpha(theme.palette.text.primary, 0.02),
            }}
          >
            {toolbar.map(renderToolbarItem)}
          </Box>
        ) : null}

        {/* Editor content */}
        <Box
          sx={{
            ...getRichTextProseSx(theme, { minHeight }),
            minHeight,
            maxHeight,
            overflowY: maxHeight ? 'auto' : undefined,
            px: 1.75,
            py: 1.5,
            bgcolor: 'transparent',
            '& .ProseMirror p.is-editor-empty:first-of-type::before': {
              content: 'attr(data-placeholder)',
              color: theme.palette.text.disabled,
              pointerEvents: 'none',
              float: 'left',
              height: 0,
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
