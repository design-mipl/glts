import type { ToolbarItem } from '@/design-system/UIComponents'

/** Compact toolbar for short applicant document instructions in modals. */
export const DOCUMENT_DESCRIPTION_RICH_TEXT_TOOLBAR: ToolbarItem[] = [
  'bold',
  'italic',
  'underline',
  'bulletList',
  'orderedList',
  'link',
  'undo',
  'redo',
]

export const DOCUMENT_DESCRIPTION_RICH_TEXT_MIN_HEIGHT = 140

export const GLTS_SCOPE_RICH_TEXT_TOOLBAR = DOCUMENT_DESCRIPTION_RICH_TEXT_TOOLBAR

export const GLTS_SCOPE_RICH_TEXT_MIN_HEIGHT = 180
