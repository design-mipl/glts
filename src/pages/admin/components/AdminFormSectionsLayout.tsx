import { Box } from '@mui/material'
import { AdminOverlayFormSection } from './AdminOverlayFormSection'
import { ADMIN_FULL_PAGE_FORM_LAYOUT } from './adminFullPageFormLayout'
import { ADMIN_DRAWER_FORM_LAYOUT } from './adminOverlayFormLayout'
import type { AdminFullPageFormSectionImportance } from './adminFullPageFormLayout'
import type { AdminFullPageFormSection } from './AdminFullPageFormShell'

export type AdminFormSectionsLayoutVariant = 'page' | 'stack'

export interface AdminFormSectionsLayoutProps {
  sections: AdminFullPageFormSection[]
  /**
   * `page` — side-by-side section cards from `sectionColumnsFrom` breakpoint upward.
   * `stack` — vertical stack (drawer).
   */
  variant?: AdminFormSectionsLayoutVariant
  /** Breakpoint where paired section cards begin (default `md` for full-page forms). */
  sectionColumnsFrom?: 'sm' | 'md'
  /** Breakpoint where multi-column field grids begin inside each section (`xs` = always). */
  fieldColumnsFrom?: 'xs' | 'sm' | 'md'
}

function defaultColumnsForImportance(
  importance: AdminFullPageFormSectionImportance | undefined,
): 1 | 2 | 3 {
  return importance === 'secondary'
    ? ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns
    : ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns
}

/**
 * Renders primary/secondary section cards with the same grid as AdminFullPageFormShell.
 */
export function AdminFormSectionsLayout({
  sections,
  variant = 'page',
  sectionColumnsFrom = 'md',
  fieldColumnsFrom = 'sm',
}: AdminFormSectionsLayoutProps) {
  const { sectionGridGap } = ADMIN_FULL_PAGE_FORM_LAYOUT
  const pairedColumns = sections.length > 1 ? '1fr 1fr' : '1fr'

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns:
          variant === 'stack'
            ? '1fr'
            : {
                xs: '1fr',
                [sectionColumnsFrom]: pairedColumns,
              },
        gap: sectionGridGap,
      }}
    >
      {sections.map((section) => {
        const importance = section.importance ?? 'primary'

        return (
          <Box
            key={section.id}
            sx={{
              gridColumn: {
                xs: '1 / -1',
                [sectionColumnsFrom]: section.span === 2 ? '1 / -1' : 'auto',
              },
            }}
          >
            <AdminOverlayFormSection
              title={section.title}
              description={section.description}
              importance={importance}
              columns={section.columns ?? defaultColumnsForImportance(section.importance)}
              fieldColumnsFrom={fieldColumnsFrom}
              headerAction={section.headerAction}
            >
              {section.children}
            </AdminOverlayFormSection>
          </Box>
        )
      })}
    </Box>
  )
}
