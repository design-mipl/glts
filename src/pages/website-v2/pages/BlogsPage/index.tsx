import { useMemo, useState } from 'react'
import { Box, Pagination, Typography } from '@mui/material'
import { PublicContainer } from '../../components/PublicContainer'
import { websiteDesignSystem as ds } from '../../theme/websiteDesignSystem'
import { getPopularArticles, searchBlogArticles } from './blogService'
import { BlogCard, BlogHero, BlogSearch, NewsletterSignup, PostListCard } from './components'
import { useBlogPageMetadata } from './useBlogPageMetadata'

const PAGE_SIZE = 6

export function BlogsPage() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const results = useMemo(() => searchBlogArticles(query), [query])
  const pageCount = Math.ceil(results.length / PAGE_SIZE)
  const visibleArticles = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useBlogPageMetadata(
    'Blogs & Visa Updates | Greenlight Travel Solutions',
    'Travel insights, destination guides and archived visa updates from Greenlight Travel Solutions.',
  )

  const handleSearch = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  return (
    <Box sx={{ bgcolor: ds.color.canvas, minWidth: 0 }}>
      <BlogHero />
      <PublicContainer sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: { xs: 3, md: 4 } }}><BlogSearch value={query} onChange={handleSearch} /></Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: { xs: 3, lg: 3.5 }, alignItems: 'start', '@media (min-width: 1200px)': { gridTemplateColumns: 'minmax(0, 3fr) minmax(250px, 1fr)' } }}>
          <Box component="section" aria-label="Blog articles" sx={{ minWidth: 0 }}>
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
            {pageCount > 1 && (
              <Pagination
                aria-label="Blog pages"
                page={page}
                count={pageCount}
                onChange={(_, nextPage) => setPage(nextPage)}
                sx={{ display: 'flex', justifyContent: 'center', mt: 4, '& .Mui-selected': { bgcolor: `${ds.color.brand} !important`, color: ds.color.navy, fontWeight: 700 }, '& .MuiPaginationItem-root:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: 2 } }}
              />
            )}
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
