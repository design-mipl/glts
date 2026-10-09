import { describe, expect, it } from 'vitest'
import { getBlogArticle, getBlogArticles, getPopularArticles, getRelatedArticles, searchBlogArticles } from './blogService'

describe('blog content service', () => {
  it('keeps all articles addressable by their unique slug', () => {
    const articles = getBlogArticles()
    expect(new Set(articles.map((article) => article.slug)).size).toBe(articles.length)
    for (const article of articles) expect(getBlogArticle(article.slug)).toBe(article)
  })

  it('searches country, topic and article body without filter controls', () => {
    expect(searchBlogArticles('Japan').map((article) => article.country)).toContain('Japan')
    expect(searchBlogArticles('appointments').some((article) => article.country === 'United States')).toBe(true)
    expect(searchBlogArticles('passport validity').some((article) => article.country === 'Thailand')).toBe(true)
    expect(searchBlogArticles('no matching destination')).toHaveLength(0)
  })

  it('uses editorial selections for popular posts and excludes the current article from related posts', () => {
    expect(getPopularArticles().every((article) => article.isPopular)).toBe(true)
    const japan = getBlogArticle('japan-simplifies-visa-process-for-indian-travellers')!
    const related = getRelatedArticles(japan)
    expect(related).toHaveLength(4)
    expect(related.some((article) => article.id === japan.id)).toBe(false)
  })
})
