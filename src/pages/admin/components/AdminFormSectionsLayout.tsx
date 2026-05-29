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
   * `page` — side-by-side section cards on md+ (full-page form grid).
   * `stack` — vertical stack (drawer).
   */
  variant?: AdminFormSectionsLayoutVariant
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
export function AdminFormSectionsLayout({ sections, variant = 'page' }: AdminFormSectionsLayoutProps) {
  const { sectionGridGap } = ADMIN_FULL_PAGE_FORM_LAYOUT

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns:
          variant === 'stack'
            ? '1fr'
            : {
                xs: '1fr',
                md: sections.length > 1 ? '1fr 1fr' : '1fr',
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
                md: section.span === 2 ? '1 / -1' : 'auto',
              },
            }}
          >
            <AdminOverlayFormSection
              title={section.title}
              description={section.description}
              importance={importance}
              columns={section.columns ?? defaultColumnsForImportance(section.importance)}
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
