import { useId, useState, type FormEvent } from 'react'
import { Box, InputAdornment, Link, TextField, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import { ArrowRight, CalendarDays, Check, ChevronRight, Clock3, Globe2, Mail, Search, Tag } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { PublicContainer } from '../../components/PublicContainer'
import { websiteButtonSx } from '../../theme/websiteComponentStyles'
import { websiteDesignSystem as ds } from '../../theme/websiteDesignSystem'
import { formatBlogDate, type ArticleBlock, type BlogArticle } from './blogService'
import { subscribeToNewsletter } from './newsletterService'

const cardSx = {
  bgcolor: ds.color.surface,
  border: `1px solid ${ds.color.border}`,
  borderRadius: `${ds.radius.large}px`,
  boxShadow: ds.shadow.subtle,
} as const

const focusSx = { '&:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: 3 } } as const

export function BlogHero({ article }: { article?: BlogArticle }) {
  const isArticle = Boolean(article)
  const title = article?.title ?? 'Blogs & Visa Updates'
  const description = article?.excerpt ?? 'Stay informed with the latest visa updates, travel news, and expert tips for your next journey.'
  const image = article?.heroImage ?? '/images/blogs/santorini.png'

  return (
    <Box
      component="section"
      aria-labelledby="blog-hero-title"
      sx={{
        minHeight: { xs: isArticle ? 292 : 250, md: isArticle ? 318 : 270 },
        display: 'flex',
        alignItems: 'center',
        color: ds.color.white,
        bgcolor: ds.color.navy,
        backgroundImage: `linear-gradient(90deg, ${alpha(ds.color.navy, 0.9)} 0%, ${alpha(ds.color.navy, 0.76)} 39%, ${alpha(ds.color.navy, 0.25)} 76%, ${alpha(ds.color.navy, 0.1)} 100%), url('${image}')`,
        backgroundSize: 'cover',
        backgroundPosition: { xs: '68% center', md: 'center 47%' },
      }}
    >
      <PublicContainer sx={{ py: { xs: 4.5, md: 5 } }}>
        <Box component="nav" aria-label="Breadcrumb" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.6, mb: 1.5, fontSize: 13 }}>
          <Link component={RouterLink} to="/" sx={{ color: ds.color.white, textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, ...focusSx }}>Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          {article ? (
            <>
              <Link component={RouterLink} to="/blogs" sx={{ color: ds.color.white, textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, ...focusSx }}>Blogs &amp; Visa Updates</Link>
              <ChevronRight size={14} aria-hidden="true" />
              <Typography component="span" sx={{ fontSize: 13, color: ds.color.white, maxWidth: { xs: '100%', sm: 430 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</Typography>
            </>
          ) : <Typography component="span" sx={{ fontSize: 13, color: ds.color.white }}>Blogs &amp; Visa Updates</Typography>}
        </Box>
        {article && <CategoryBadge category={article.category} onDark />}
        <Typography
          id="blog-hero-title"
          component="h1"
          sx={{ fontFamily: ds.fonts.display, maxWidth: isArticle ? 760 : 800, mt: article ? 1.25 : 0, mb: 1.25, fontSize: { xs: 32, lg: 39, desktop: isArticle ? 46 : 48 }, fontWeight: ds.type.h1.weight, lineHeight: 1.13, letterSpacing: ds.type.h1.tracking }}
        >
          {title}
        </Typography>
        <Typography sx={{ maxWidth: 630, color: alpha(ds.color.white, 0.94), fontSize: { xs: 15, md: 17 }, lineHeight: 1.55 }}>
          {description}
        </Typography>
      </PublicContainer>
    </Box>
  )
}

export function CategoryBadge({ category, onDark = false }: { category: string; onDark?: boolean }) {
  const badgeColors: Record<string, { background: string; foreground: string }> = {
    'Visa Update': { background: ds.color.successSurface, foreground: ds.color.success },
    'Travel News': { background: ds.color.surfaceMuted, foreground: ds.color.teal },
    'Travel Guide': { background: ds.color.surfaceMuted, foreground: ds.color.navy },
    'Travel Tips': { background: ds.color.warningSurface, foreground: ds.color.warning },
  }
  const colors = badgeColors[category] ?? { background: ds.color.surfaceMuted, foreground: ds.color.navy }
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'max-content',
        maxWidth: '100%',
        minHeight: 28,
        px: 1.25,
        py: 0.5,
        boxSizing: 'border-box',
        borderRadius: `${ds.radius.pill}px`,
        border: `1px solid ${alpha(ds.color.navy, 0.08)}`,
        color: onDark ? ds.color.navy : colors.foreground,
        bgcolor: onDark ? ds.color.white : colors.background,
        boxShadow: onDark ? 'none' : `0 2px 8px ${alpha(ds.color.navy, 0.14)}`,
        fontSize: 12,
        lineHeight: 1,
        fontWeight: 700,
        letterSpacing: '0.025em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {category}
    </Box>
  )
}

export function BlogCard({ article }: { article: BlogArticle }) {
  return (
    <Box
      component={RouterLink}
      to={`/blogs/${article.slug}`}
      aria-label={`Read ${article.title}`}
      sx={{
        ...cardSx,
        ...focusSx,
        minWidth: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: 'inherit',
        textDecoration: 'none',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: ds.shadow.elevated },
        '&:hover .blog-card-image': { transform: 'scale(1.035)' },
        '&:hover .blog-card-arrow': { transform: 'translateX(3px)' },
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden', bgcolor: ds.color.surfaceMuted }}>
        <Box component="img" className="blog-card-image" src={article.featuredImage} alt={article.imageAlt} loading="lazy" sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 220ms ease' }} />
        <Box sx={{ position: 'absolute', top: 12, left: 12 }}><CategoryBadge category={article.category} /></Box>
      </Box>
      <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', p: { xs: 2.25, md: 2.5 } }}>
        <Typography component="time" dateTime={article.publishedAt} sx={{ color: ds.color.textSecondary, fontSize: 12, fontWeight: 600, mb: 1 }}>
          {formatBlogDate(article.publishedAt)}
        </Typography>
        <Typography component="h2" sx={{ color: ds.color.navy, fontSize: { xs: 18, md: 17 }, fontWeight: 700, lineHeight: 1.35, mb: 1.1 }}>
          {article.title}
        </Typography>
        <Typography sx={{ color: ds.color.textSecondary, fontSize: 13.5, lineHeight: 1.55, mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {article.excerpt}
        </Typography>
        <Box component="span" sx={{ mt: 'auto', display: 'inline-flex', alignItems: 'center', gap: 0.65, color: ds.color.brandHover, fontWeight: 700, fontSize: 13 }}>
          Read More <ArrowRight className="blog-card-arrow" size={16} style={{ transition: 'transform 180ms ease' }} aria-hidden="true" />
        </Box>
      </Box>
    </Box>
  )
}

export function PostListCard({ title, articles }: { title: 'Popular Posts' | 'Related Posts'; articles: BlogArticle[] }) {
  const headingId = title === 'Popular Posts' ? 'popular-posts-title' : 'related-posts-title'
  return (
    <Box component="section" aria-labelledby={headingId} sx={{ ...cardSx, p: { xs: 2.5, md: 3 } }}>
      <Typography id={headingId} component="h2" sx={{ color: ds.color.navy, fontSize: 20, fontWeight: 700, mb: 1.75 }}>{title}</Typography>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {articles.map((article, index) => (
          <Box component="li" key={article.id} sx={{ borderTop: index ? `1px solid ${ds.color.border}` : 0, pt: index ? 1.5 : 0, pb: index === articles.length - 1 ? 0 : 1.5 }}>
            <Box component={RouterLink} to={`/blogs/${article.slug}`} sx={{ ...focusSx, display: 'flex', alignItems: 'center', gap: 1.5, color: 'inherit', textDecoration: 'none', borderRadius: `${ds.radius.small}px`, '&:hover h3': { color: ds.color.brandHover } }}>
              <Box component="img" src={article.featuredImage} alt="" loading="lazy" sx={{ width: 76, height: 62, flexShrink: 0, objectFit: 'cover', borderRadius: `${ds.radius.small}px` }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography component="h3" sx={{ color: ds.color.navy, fontSize: 13, fontWeight: 700, lineHeight: 1.35, transition: 'color 180ms ease' }}>{article.title}</Typography>
                <Typography component="time" dateTime={article.publishedAt} sx={{ display: 'block', mt: 0.35, color: ds.color.textSecondary, fontSize: 11 }}>{formatBlogDate(article.publishedAt)}</Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export function NewsletterSignup() {
  const fieldId = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus('error')
      setMessage('Enter a valid email address.')
      return
    }
    setStatus('loading')
    setMessage('')
    try {
      await subscribeToNewsletter(value)
      setStatus('success')
      setMessage('You are subscribed to the latest updates.')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'We could not subscribe you right now. Please try again later.')
    }
  }

  return (
    <Box component="section" aria-labelledby="newsletter-title" sx={{ ...cardSx, p: { xs: 2.5, md: 3 } }}>
      <Typography id="newsletter-title" component="h2" sx={{ color: ds.color.navy, fontSize: 20, fontWeight: 700, mb: 0.75 }}>Get the Latest Updates</Typography>
      <Typography sx={{ color: ds.color.textSecondary, fontSize: 13.5, lineHeight: 1.5, mb: 2 }}>
        Subscribe to our newsletter and never miss important visa updates and travel insights.
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box>
          <TextField
            id={fieldId}
            type="email"
            label="Email address"
            placeholder="Enter your email address"
            value={email}
            onChange={(event) => { setEmail(event.target.value); if (status !== 'loading') { setStatus('idle'); setMessage('') } }}
            autoComplete="email"
            fullWidth
            size="small"
            error={status === 'error'}
            inputProps={{ 'aria-describedby': message ? `${fieldId}-status` : undefined }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={17} color={ds.color.textSecondary} aria-hidden="true" /></InputAdornment> }}
            sx={{ '& .MuiOutlinedInput-root': { minHeight: 48, borderRadius: `${ds.radius.medium}px`, bgcolor: ds.color.white }, '& .MuiOutlinedInput-root.Mui-focused': { outline: `2px solid ${ds.color.focus}`, outlineOffset: 2 } }}
          />
        </Box>
        {message && <Typography id={`${fieldId}-status`} role={status === 'error' ? 'alert' : 'status'} sx={{ color: status === 'error' ? ds.color.error : ds.color.success, fontSize: 12, mt: 1 }}>{message}</Typography>}
        <Button type="submit" loading={status === 'loading'} disabled={status === 'success'} fullWidth endIcon={<ArrowRight size={16} aria-hidden="true" />} sx={{ ...websiteButtonSx, minHeight: 46, mt: 1.5, bgcolor: ds.color.navy, color: ds.color.white, '&.MuiButton-containedPrimary': { bgcolor: ds.color.navy, color: ds.color.white }, '&.MuiButton-containedPrimary:hover': { bgcolor: ds.color.brandHover, color: ds.color.white } }}>
          {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed' : 'Subscribe'}
        </Button>
      </Box>
    </Box>
  )
}

export function ArticleMeta({ article }: { article: BlogArticle }) {
  const items = [
    { icon: <CalendarDays size={16} />, text: formatBlogDate(article.publishedAt) },
    { icon: <Clock3 size={16} />, text: `${article.readTime} min read` },
    { icon: <Globe2 size={16} />, text: article.country },
    { icon: <Tag size={16} />, text: article.category },
  ]
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, md: 2.5 }, alignItems: 'center', color: ds.color.textSecondary, fontSize: 13 }}>
      {items.map((item) => <Box key={item.text} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.65 }} aria-label={item.text}>{item.icon}<span>{item.text}</span></Box>)}
    </Box>
  )
}

function ArticleBlockView({ block }: { block: ArticleBlock }) {
  if (block.type === 'heading') {
    return <Typography component={block.level === 2 ? 'h2' : 'h3'} sx={{ fontFamily: block.level === 2 ? ds.fonts.display : ds.fonts.ui, color: ds.color.navy, fontSize: block.level === 2 ? { xs: 23, md: 26 } : { xs: 19, md: 21 }, fontWeight: 700, lineHeight: 1.3, mt: block.level === 2 ? 4 : 3, mb: 1.2 }}>{block.text}</Typography>
  }
  if (block.type === 'paragraph') {
    return <Typography component="p" sx={{ color: ds.color.textSecondary, fontSize: 16, lineHeight: 1.75, mt: 0, mb: 2 }}>{block.text}</Typography>
  }
  if (block.type === 'list') {
    return (
      <Box component={block.ordered ? 'ol' : 'ul'} sx={{ listStyle: block.checked ? 'none' : undefined, pl: block.checked ? 0 : 3, my: 1.5, display: 'grid', gap: 1.1 }}>
        {block.items.map((item) => <Box component="li" key={item} sx={{ display: block.checked ? 'flex' : 'list-item', gap: 1, color: ds.color.textSecondary, fontSize: 15.5, lineHeight: 1.65 }}>{block.checked && <Check size={19} color={ds.color.brandHover} style={{ flexShrink: 0, marginTop: 3 }} aria-hidden="true" />}{item}</Box>)}
      </Box>
    )
  }
  if (block.type === 'callout') {
    const notice = block.tone === 'notice'
    return (
      <Box sx={{ my: 2.5, p: { xs: 2.25, md: 2.75 }, borderLeft: `3px solid ${notice ? ds.color.teal : ds.color.brand}`, borderRadius: `${ds.radius.medium}px`, bgcolor: notice ? alpha(ds.color.teal, 0.07) : ds.color.successSurface }}>
        <Typography component="h3" sx={{ color: ds.color.navy, fontSize: 16, fontWeight: 700, mb: block.text || block.items ? 0.75 : 0 }}>{block.title}</Typography>
        {block.text && <Typography sx={{ color: ds.color.textSecondary, fontSize: 14.5, lineHeight: 1.65 }}>{block.text}</Typography>}
        {block.items && <Box component="ul" sx={{ pl: 2.5, mb: 0.25, mt: 0.75, color: ds.color.textSecondary, fontSize: 14.5, lineHeight: 1.75 }}>{block.items.map((item) => <li key={item}>{item}</li>)}</Box>}
      </Box>
    )
  }
  if (block.type === 'image') {
    return <Box component="figure" sx={{ m: 0, my: 3 }}><Box component="img" src={block.src} alt={block.alt} loading="lazy" sx={{ display: 'block', width: '100%', borderRadius: `${ds.radius.medium}px` }} />{block.caption && <Typography component="figcaption" sx={{ mt: 0.75, color: ds.color.textSecondary, fontSize: 12 }}>{block.caption}</Typography>}</Box>
  }
  if (block.type === 'link') {
    return <Typography component="p" sx={{ color: ds.color.textSecondary, fontSize: 16, lineHeight: 1.75, mb: 2 }}>{block.text && `${block.text} `}<Link href={block.href} sx={{ color: ds.color.brandHover, fontWeight: 700, '&:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: 3 } }}>{block.label}</Link></Typography>
  }
  return (
    <Box sx={{ overflowX: 'auto', my: 2.5 }}>
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', minWidth: 480, '& th, & td': { p: 1.5, border: `1px solid ${ds.color.border}`, textAlign: 'left', fontSize: 14 }, '& th': { color: ds.color.navy, bgcolor: ds.color.surfaceMuted } }}>
        <thead><tr>{block.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>{block.rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
      </Box>
    </Box>
  )
}

export function ArticleContent({ article }: { article: BlogArticle }) {
  return <Box component="div" sx={{ maxWidth: 780 }}>{article.content.map((block, index) => <ArticleBlockView key={`${article.id}-${index}`} block={block} />)}</Box>
}

export function BlogSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Box sx={{ maxWidth: 480 }}>
      <TextField
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search articles, countries or topics..."
        aria-label="Search articles, countries or topics"
        fullWidth
        size="small"
        InputProps={{ startAdornment: <InputAdornment position="start"><Search size={19} color={ds.color.textSecondary} aria-hidden="true" /></InputAdornment> }}
        sx={{ '& .MuiOutlinedInput-root': { minHeight: 48, borderRadius: `${ds.radius.pill}px`, bgcolor: ds.color.surface }, '& .MuiOutlinedInput-root.Mui-focused': { outline: `2px solid ${ds.color.focus}`, outlineOffset: 2 } }}
      />
    </Box>
  )
}
