import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { ArrowLeft, Link2 } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { PublicContainer } from '../../components/PublicContainer'
import { websiteDesignSystem as ds } from '../../theme/websiteDesignSystem'
import { getBlogArticle, getRelatedArticles } from './blogService'
import { ArticleContent, ArticleMeta, BlogHero, NewsletterSignup, PostListCard } from './components'
import { useBlogPageMetadata } from './useBlogPageMetadata'

export function BlogArticlePage() {
  const { slug = '' } = useParams()
  const article = getBlogArticle(slug)
  const [shareMessage, setShareMessage] = useState('')

  useBlogPageMetadata(
    article?.seoTitle ?? 'Article not found | Greenlight Travel Solutions',
    article?.seoDescription ?? 'Explore Blogs & Visa Updates from Greenlight Travel Solutions.',
  )

  if (!article) {
    return (
      <Box sx={{ bgcolor: ds.color.canvas }}>
        <BlogHero />
        <PublicContainer sx={{ py: { xs: 8, md: 12 } }}>
          <Typography component="h2" sx={{ color: ds.color.navy, fontSize: ds.type.h2.mobile, fontWeight: 700, mb: 1 }}>Article not found</Typography>
          <Typography sx={{ color: ds.color.textSecondary, mb: 3 }}>This article may have moved or is no longer available.</Typography>
          <Button href="/blogs" startIcon={<ArrowLeft size={17} />}>Back to Blogs &amp; Visa Updates</Button>
        </PublicContainer>
      </Box>
    )
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareMessage('Article link copied.')
    } catch {
      setShareMessage('Could not copy the link. Use your browser address bar to share this article.')
    }
  }

  return (
    <Box sx={{ bgcolor: ds.color.canvas, minWidth: 0 }}>
      <BlogHero article={article} />
      <PublicContainer sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: { xs: 3, lg: 3.5 }, alignItems: 'start', '@media (min-width: 1200px)': { gridTemplateColumns: 'minmax(0, 3fr) minmax(250px, 1fr)' } }}>
          <Box component="article" sx={{ minWidth: 0, p: { xs: 2.5, sm: 3.5, md: 4 }, bgcolor: ds.color.surface, border: `1px solid ${ds.color.border}`, borderRadius: `${ds.radius.large}px`, boxShadow: ds.shadow.subtle }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, pb: 2.5, borderBottom: `1px solid ${ds.color.border}` }}>
              <ArticleMeta article={article} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ color: ds.color.textSecondary, fontSize: 12 }}>Share</Typography>
                <Button variant="text" size="sm" onClick={copyLink} startIcon={<Link2 size={16} aria-hidden="true" />} sx={{ color: ds.color.brandHover, minHeight: 34, '&:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: 2 } }}>Copy link</Button>
              </Box>
            </Box>
            {shareMessage && <Typography role="status" sx={{ color: ds.color.textSecondary, fontSize: 12, mt: 1 }}>{shareMessage}</Typography>}
            <Box component="figure" sx={{ m: 0, my: 3 }}>
              <Box component="img" src={article.featuredImage} alt={article.imageAlt} sx={{ display: 'block', width: '100%', aspectRatio: '16 / 8', objectFit: 'cover', objectPosition: 'center 58%', borderRadius: `${ds.radius.medium}px` }} />
            </Box>
            <ArticleContent article={article} />
            <Box sx={{ borderTop: `1px solid ${ds.color.border}`, mt: 5, pt: 2.5 }}>
              <Typography sx={{ color: ds.color.textSecondary, fontSize: 13, mb: 1.5 }}>By {article.author}</Typography>
              <Box component={RouterLink} to="/blogs" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, color: ds.color.brandHover, textDecoration: 'none', fontSize: 14, fontWeight: 700, '&:hover': { textDecoration: 'underline' }, '&:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: 3 } }}>
                <ArrowLeft size={16} aria-hidden="true" /> All Blogs &amp; Visa Updates
              </Box>
            </Box>
          </Box>
          <Box component="aside" aria-label="Article sidebar" sx={{ minWidth: 0, display: 'grid', gap: 2.5, gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' }, '@media (min-width: 1200px)': { gridTemplateColumns: 'minmax(0, 1fr)' } }}>
            <PostListCard title="Related Posts" articles={getRelatedArticles(article)} />
            <NewsletterSignup />
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
