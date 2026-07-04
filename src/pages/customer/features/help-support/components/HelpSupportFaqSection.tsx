import { useMemo, useState } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { ChevronDown, Search, ThumbsDown, ThumbsUp } from 'lucide-react'
import { FormField, Input, Select, useToast } from '@/design-system/UIComponents'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { PORTAL_FAQ_CATEGORIES } from '../data/portalFaqCategories'
import { PORTAL_FAQS, type PortalFaqItem, type PortalFaqSortOption } from '../data/portalFaqs'

function formatFaqDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function sortFaqs(items: PortalFaqItem[], sortBy: PortalFaqSortOption): PortalFaqItem[] {
  const copy = [...items]
  if (sortBy === 'newest') {
    return copy.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
  }
  if (sortBy === 'most_viewed') {
    return copy.sort((a, b) => b.viewCount - a.viewCount)
  }
  return copy.sort((a, b) => a.question.localeCompare(b.question))
}

export function HelpSupportFaqSection() {
  const colors = usePublicBrandColors()
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<PortalFaqSortOption>('newest')
  const [expanded, setExpanded] = useState<Set<string>>(new Set([PORTAL_FAQS[0]?.id]))
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({})

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase()
    let items = PORTAL_FAQS
    if (category !== 'all') {
      items = items.filter(faq => faq.category === category)
    }
    if (query) {
      items = items.filter(
        faq =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query) ||
          faq.category.toLowerCase().includes(query),
      )
    }
    return sortFaqs(items, sortBy)
  }, [search, category, sortBy])

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleFeedback = (id: string, vote: 'up' | 'down') => {
    setFeedback(prev => ({ ...prev, [id]: vote }))
    showToast({
      title: vote === 'up' ? 'Thanks for your feedback' : 'Feedback recorded',
      description: 'Your response helps us improve help content.',
      variant: 'success',
    })
  }

  return (
    <Stack spacing={2.5}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 180px 180px' },
          gap: 1.5,
          alignItems: 'end',
        }}
      >
        <FormField label="Search FAQs">
          <Input
            value={search}
            onChange={setSearch}
            placeholder="Search questions or answers"
            startAdornment={<Search size={16} />}
          />
        </FormField>
        <FormField label="Category">
          <Select
            value={category}
            onChange={value => setCategory(String(value))}
            options={[
              { value: 'all', label: 'All categories' },
              ...PORTAL_FAQ_CATEGORIES.map(cat => ({ value: cat, label: cat })),
            ]}
          />
        </FormField>
        <FormField label="Sort by">
          <Select
            value={sortBy}
            onChange={value => setSortBy(value as PortalFaqSortOption)}
            options={[
              { value: 'newest', label: 'Newest' },
              { value: 'most_viewed', label: 'Most viewed' },
              { value: 'alphabetical', label: 'Alphabetical' },
            ]}
          />
        </FormField>
      </Box>

      <Stack spacing={1.25}>
        {filteredFaqs.length === 0 ? (
          <Box
            sx={{
              py: 4,
              px: 2,
              textAlign: 'center',
              border: `1px dashed ${colors.border}`,
              borderRadius: BORDER_RADIUS.lg,
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.navy }}>
              No FAQs match your filters
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: colors.textSecondary }}>
              Try a different search term or category.
            </Typography>
          </Box>
        ) : (
          filteredFaqs.map(faq => {
            const isOpen = expanded.has(faq.id)
            const userVote = feedback[faq.id]
            return (
              <Box
                key={faq.id}
                sx={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: BORDER_RADIUS.lg,
                  bgcolor: colors.white,
                  overflow: 'hidden',
                  boxShadow: isOpen ? '0 2px 8px rgba(15, 38, 92, 0.06)' : 'none',
                }}
              >
                <Box
                  component="button"
                  type="button"
                  onClick={() => toggle(faq.id)}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    border: 0,
                    bgcolor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                    useFlexGap
                    sx={{ minWidth: 0, flex: 1 }}
                  >
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.navy, lineHeight: 1.4 }}>
                      {faq.question}
                    </Typography>
                    <CustomerStatusChip label={faq.category} tone="info" />
                  </Stack>
                  <ChevronDown
                    size={18}
                    style={{
                      flexShrink: 0,
                      marginTop: 2,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms',
                      color: colors.textMuted,
                    }}
                  />
                </Box>
                <Collapse in={isOpen}>
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Typography sx={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.65 }}>
                      {faq.answer}
                    </Typography>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      justifyContent="space-between"
                      spacing={1.5}
                      sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${colors.border}` }}
                    >
                      <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
                        Last updated {formatFaqDate(faq.lastUpdated)}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary }}>
                          Helpful?
                        </Typography>
                        <Box
                          component="button"
                          type="button"
                          onClick={() => handleFeedback(faq.id, 'up')}
                          aria-label="Mark as helpful"
                          sx={{
                            display: 'grid',
                            placeItems: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: BORDER_RADIUS.md,
                            border: `1px solid ${userVote === 'up' ? colors.greenDark : colors.border}`,
                            bgcolor: userVote === 'up' ? colors.greenMuted : colors.white,
                            cursor: 'pointer',
                            color: userVote === 'up' ? colors.greenDark : colors.textSecondary,
                          }}
                        >
                          <ThumbsUp size={15} />
                        </Box>
                        <Box
                          component="button"
                          type="button"
                          onClick={() => handleFeedback(faq.id, 'down')}
                          aria-label="Mark as not helpful"
                          sx={{
                            display: 'grid',
                            placeItems: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: BORDER_RADIUS.md,
                            border: `1px solid ${userVote === 'down' ? '#DC2626' : colors.border}`,
                            bgcolor: userVote === 'down' ? colors.criticalMuted : colors.white,
                            cursor: 'pointer',
                            color: userVote === 'down' ? '#DC2626' : colors.textSecondary,
                          }}
                        >
                          <ThumbsDown size={15} />
                        </Box>
                      </Stack>
                    </Stack>
                  </Box>
                </Collapse>
              </Box>
            )
          })
        )}
      </Stack>
    </Stack>
  )
}
