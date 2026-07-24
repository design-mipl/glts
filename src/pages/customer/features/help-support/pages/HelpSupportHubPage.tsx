import { useCallback, useMemo } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { CustomerPageHeader } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import {
  HELP_SUPPORT_SECTIONS,
  isHelpSupportSectionId,
  type HelpSupportSectionId,
} from '../config/helpSupportSections'
import { HelpSupportWorkspaceShell } from '../components/HelpSupportWorkspaceShell'
import { HelpSupportFaqSection } from '../components/HelpSupportFaqSection'
import { HelpSupportArticlesSection } from '../components/HelpSupportArticlesSection'
import { HelpSupportGuidesSection } from '../components/HelpSupportGuidesSection'
import { HelpSupportCategoriesSection } from '../components/HelpSupportCategoriesSection'

function renderSectionContent(sectionId: HelpSupportSectionId) {
  switch (sectionId) {
    case 'faq':
      return <HelpSupportFaqSection />
    case 'articles':
      return <HelpSupportArticlesSection />
    case 'guides':
      return <HelpSupportGuidesSection />
    case 'categories':
      return <HelpSupportCategoriesSection />
    default:
      return <HelpSupportFaqSection />
  }
}

export function HelpSupportHubPage() {
  const { base } = useCustomerPortalBase()
  const navigate = useNavigate()
  const { sectionId: sectionParam } = useParams<{ sectionId?: string }>()

  const activeSectionId: HelpSupportSectionId = isHelpSupportSectionId(sectionParam) ? sectionParam : 'faq'

  const handleSectionClick = useCallback(
    (sectionId: string) => {
      if (!isHelpSupportSectionId(sectionId)) return
      navigate(`${base}/support/${sectionId}`)
    },
    [base, navigate],
  )

  const activeSection = useMemo(
    () => HELP_SUPPORT_SECTIONS.find(section => section.id === activeSectionId) ?? HELP_SUPPORT_SECTIONS[0],
    [activeSectionId],
  )

  const contentPanel = useMemo(
    () => (
      <Stack spacing={3}>
        <Box sx={{ px: 0.5 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: 15 }}>
            {activeSection.label}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 560 }}>
            {activeSection.description}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ px: 0.5, pt: 0.5 }}>{renderSectionContent(activeSectionId)}</Box>
      </Stack>
    ),
    [activeSection, activeSectionId],
  )

  return (
    <Box>
      <CustomerPageHeader
        title="Help Center"
        subtitle="Find answers, read articles, download guides, and browse support topics for the customer portal."
      />

      <Box sx={{ mt: 3 }}>
        <HelpSupportWorkspaceShell
          sections={HELP_SUPPORT_SECTIONS}
          activeSectionId={activeSectionId}
          onSectionClick={handleSectionClick}
          contentPanel={contentPanel}
        />
      </Box>
    </Box>
  )
}

/** @deprecated Use HelpSupportHubPage — kept for route compatibility. */
export function FaqPage() {
  return <HelpSupportHubPage />
}
