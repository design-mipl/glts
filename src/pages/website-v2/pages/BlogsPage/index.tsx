import { useEffect, useMemo, useRef } from 'react'
import { Box, Button, Pagination, Typography } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { PublicContainer } from '../../components/PublicContainer'
import { websiteDesignSystem as ds } from '../../theme/websiteDesignSystem'
import { getPopularArticles, searchBlogArticles } from './blogService'
import { BlogCard, BlogHero, BlogSearch, NewsletterSignup, PostListCard } from './components'
import { useBlogPageMetadata } from './useBlogPageMetadata'

const PAGE_SIZE = 6

function BlogPagination({ page, pageCount, onPageChange }: { page: number; pageCount: number; onPageChange: (page: number) => void }) {
  const navigationButtonSx = {
    minHeight: 40,
    px: { xs: 0.75, sm: 1.5 },
    borderRadius: `${ds.radius.medium}px`,
    borderColor: ds.color.borderStrong,
    color: ds.color.navy,
    fontSize: { xs: 12, sm: 13 },
    fontWeight: 700,
    textTransform: 'none',
    whiteSpace: 'nowrap',
    '&:hover': { borderColor: ds.color.brandHover, bgcolor: ds.color.successSurface },
    '&.Mui-disabled': { borderColor: ds.color.border, color: ds.color.textMuted },
    '&:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: 2 },
  } as const
  const pageNumbersSx = {
    '& .MuiPagination-ul': { justifyContent: 'center', flexWrap: 'nowrap' },
    '& .MuiPaginationItem-root': { color: ds.color.navy, fontWeight: 600 },
    '& .MuiPaginationItem-page.Mui-selected': {
      bgcolor: ds.color.brand,
      color: ds.color.navy,
      fontWeight: 800,
      '&:hover': { bgcolor: ds.color.brand },
    },
    '& .MuiPaginationItem-root:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: 2 },
  } as const

  return (
    <Box role="group" aria-label="Blog pagination" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 0.5, sm: 1.5 }, mt: { xs: 5, md: 6 }, minWidth: 0 }}>
      <Button variant="outlined" disabled={page === 1} onClick={() => onPageChange(page - 1)} sx={navigationButtonSx}>
        Previous
      </Button>
      <Box sx={{ display: { xs: 'none', sm: 'block', lg: 'none' } }}>
        <Pagination page={page} count={pageCount} siblingCount={0} boundaryCount={1} onChange={(_, nextPage) => onPageChange(nextPage)} sx={pageNumbersSx} />
      </Box>
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <Pagination page={page} count={pageCount} siblingCount={1} boundaryCount={1} onChange={(_, nextPage) => onPageChange(nextPage)} sx={pageNumbersSx} />
      </Box>
      <Typography aria-live="polite" sx={{ display: { xs: 'block', sm: 'none' }, color: ds.color.navy, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
        Page {page} of {pageCount}
      </Typography>
      <Button variant="outlined" disabled={page === pageCount} onClick={() => onPageChange(page + 1)} sx={navigationButtonSx}>
        Next
      </Button>
    </Box>
  )
}

export function BlogsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const articleListRef = useRef<HTMLElement>(null)
  const previousPageRef = useRef<number | null>(null)
  const results = useMemo(() => searchBlogArticles(query), [query])
  const pageCount = Math.ceil(results.length / PAGE_SIZE)
  const pageParam = searchParams.get('page')
  const requestedPage = pageParam && /^\d+$/.test(pageParam) ? Number(pageParam) : 1
  const page = Math.min(Math.max(requestedPage, 1), Math.max(pageCount, 1))
  const visibleArticles = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    if (pageParam === null || pageParam === String(page)) return
    setSearchParams(previous => {
      const next = new URLSearchParams(previous)
      next.set('page', String(page))
      return next
    }, { replace: true })
  }, [page, pageParam, setSearchParams])

  useEffect(() => {
    if (previousPageRef.current === null) {
      previousPageRef.current = page
      return
    }
    if (previousPageRef.current === page) return
    previousPageRef.current = page
    const frame = requestAnimationFrame(() => {
      articleListRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [page])

  useBlogPageMetadata(
    'Blogs & Visa Updates | Greenlight Travel Solutions',
    'Travel insights, destination guides and archived visa updates from Greenlight Travel Solutions.',
  )

  const handleSearch = (value: string) => {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous)
      if (value) next.set('q', value)
      else next.delete('q')
      next.set('page', '1')
      return next
    }, { replace: true })
  }

  const handlePageChange = (nextPage: number) => {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous)
      next.set('page', String(nextPage))
      return next
    })
  }

  return (
    <Box sx={{ bgcolor: ds.color.canvas, minWidth: 0 }}>
      <BlogHero />
      <PublicContainer sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: { xs: 3, md: 4 } }}><BlogSearch value={query} onChange={handleSearch} /></Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: { xs: 3, lg: 3.5 }, alignItems: 'start', '@media (min-width: 1200px)': { gridTemplateColumns: 'minmax(0, 3fr) minmax(250px, 1fr)' } }}>
          <Box component="section" ref={articleListRef} aria-label="Blog articles" sx={{ minWidth: 0, scrollMarginTop: '96px' }}>
            {visibleArticles.length ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' }, '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }, gap: { xs: 2.5, md: 3 }, alignItems: 'stretch' }}>
                {visibleArticles.map((article) => <BlogCard key={article.id} article={article} />)}
              </Box>
            ) : (
              <Box sx={{ bgcolor: ds.color.surface, border: `1px solid ${ds.color.border}`, borderRadius: `${ds.radius.large}px`, p: { xs: 3, md: 5 } }}>
                <Typography component="h2" sx={{ color: ds.color.navy, fontSize: 22, fontWeight: 700, mb: 1 }}>No articles found</Typography>
                <Typography sx={{ color: ds.color.textSecondary }}>Try another country, topic or keyword.</Typography>
              </Box>
            )}
            {(pageCount > 1 || (!query && pageCount === 1)) && <BlogPagination page={page} pageCount={pageCount} onPageChange={handlePageChange} />}
          </Box>
          <Box component="aside" aria-label="Blog sidebar" sx={{ minWidth: 0, display: 'grid', gap: 2.5, gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' }, '@media (min-width: 1200px)': { gridTemplateColumns: 'minmax(0, 1fr)' } }}>
            <PostListCard title="Popular Posts" articles={getPopularArticles()} />
            <NewsletterSignup />
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
