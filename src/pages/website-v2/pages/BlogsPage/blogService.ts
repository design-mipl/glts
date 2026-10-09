export type ArticleBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean; checked?: boolean }
  | { type: 'callout'; title: string; text?: string; items?: string[]; tone?: 'green' | 'notice' }
  | { type: 'link'; href: string; label: string; text?: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }

export interface BlogArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: ArticleBlock[]
  featuredImage: string
  heroImage: string
  imageAlt: string
  category: string
  country: string
  publishedAt: string
  updatedAt: string
  author: string
  readTime: number
  tags: string[]
  isPopular: boolean
  viewCount?: number
  seoTitle: string
  seoDescription: string
}

const editorialTeam = 'Greenlight Travel Solutions Editorial Team'
const archiveNotice: ArticleBlock = {
  type: 'callout',
  tone: 'notice',
  title: 'Check current requirements before you travel',
  text: 'This archived sample article illustrates the blog experience. Visa policies, appointment availability and entry rules can change. Confirm the latest details with the relevant official authority before making plans.',
}

/** Replace this source with a CMS adapter when publishing is connected; UI consumes BlogArticle only. */
const articles: BlogArticle[] = [
  {
    id: 'japan-visa-2024',
    slug: 'japan-simplifies-visa-process-for-indian-travellers',
    title: 'Japan Simplifies Visa Process for Indian Travellers',
    excerpt: 'A closer look at Japan visa preparation for Indian travellers, including documents, timing and application planning.',
    featuredImage: '/images/blogs/japan.png',
    heroImage: '/images/blogs/japan.png',
    imageAlt: 'Mount Fuji, a red pagoda and cherry blossoms in Japan',
    category: 'Visa Update',
    country: 'Japan',
    publishedAt: '2024-10-12',
    updatedAt: '2024-10-12',
    author: editorialTeam,
    readTime: 5,
    tags: ['Indian travellers', 'visa process', 'documents', 'Asia'],
    isPopular: true,
    seoTitle: 'Japan Visa Process for Indian Travellers | Greenlight Travel Solutions',
    seoDescription: 'Explore the documents, timing and steps to consider when planning a Japan visa application from India.',
    content: [
      { type: 'paragraph', text: 'Japan is a popular choice for Indian travellers, and a well-prepared application starts with understanding the current visa category and document checklist. This guide explains the planning points to review before you apply.' },
      archiveNotice,
      { type: 'heading', level: 2, text: 'Key Highlights' },
      { type: 'list', checked: true, items: ['Match your visa category to your travel purpose.', 'Prepare a complete and consistent document set.', 'Allow time for appointments and processing before booking fixed plans.', 'Check whether a single or multiple entry visa suits your itinerary.'] },
      { type: 'heading', level: 2, text: 'Who is Eligible?' },
      { type: 'paragraph', text: 'Eligibility depends on nationality, purpose of travel, travel history and the requirements in force when the application is submitted. Indian passport holders should use the official Japanese mission or authorised application channel for the latest criteria.' },
      { type: 'heading', level: 2, text: 'Documents Required' },
      { type: 'paragraph', text: 'The exact list varies by visa type. These are common document groups to check against the current official checklist:' },
      { type: 'callout', tone: 'green', title: 'Prepare your documents', items: ['Valid passport and application form', 'Recent passport-size photographs', 'Travel itinerary and accommodation details', 'Financial documents relevant to the application', 'Employment, business or invitation documents where applicable'] },
      { type: 'heading', level: 2, text: 'Application Process' },
      { type: 'list', ordered: true, items: ['Confirm the appropriate visa category and current submission channel.', 'Review the official checklist and prepare supporting documents.', 'Submit the application through the designated process.', 'Track the application and respond to any additional document request.'] },
      { type: 'heading', level: 2, text: 'Processing Time' },
      { type: 'paragraph', text: 'Processing periods can change with season, application volume and individual circumstances. Check the official guidance when you apply and leave a practical buffer before departure.' },
      { type: 'heading', level: 2, text: 'Important Considerations' },
      { type: 'paragraph', text: 'Keep names, dates and travel details consistent across the form and supporting documents. Avoid committing to non-refundable travel until you understand the current guidance and your application outcome.' },
      { type: 'heading', level: 2, text: 'Latest Updates' },
      { type: 'paragraph', text: 'For the latest Japan visa instructions, refer to the Embassy or Consulate of Japan and its authorised visa application partner. Greenlight can help you organise documents and review your application against the current checklist.' },
    ],
  },
  {
    id: 'schengen-rules-2024',
    slug: 'schengen-visa-rules-updated-for-2024',
    title: 'Schengen Visa Rules Updated for 2024',
    excerpt: 'Planning a trip across Europe? Review the documents and timing that matter for a Schengen visa application.',
    featuredImage: '/images/blogs/paris.png',
    heroImage: '/images/blogs/paris.png',
    imageAlt: 'The Eiffel Tower and the Seine in Paris',
    category: 'Travel News',
    country: 'Schengen Area',
    publishedAt: '2024-10-10',
    updatedAt: '2024-10-10',
    author: editorialTeam,
    readTime: 4,
    tags: ['Europe', 'Schengen', 'visa process', 'documents'],
    isPopular: true,
    seoTitle: 'Schengen Visa Planning Guide | Greenlight Travel Solutions',
    seoDescription: 'Review practical Schengen visa application planning tips, from selecting the right destination to preparing documents.',
    content: [
      { type: 'paragraph', text: 'A multi-country trip can make the visa process feel complicated. Start by confirming which country should receive your application, then build a document set that accurately reflects your itinerary.' },
      archiveNotice,
      { type: 'heading', level: 2, text: 'Before You Apply' },
      { type: 'list', checked: true, items: ['Confirm the responsible country for your application.', 'Check passport validity and the current insurance requirement.', 'Prepare a coherent itinerary and supporting financial documents.', 'Look for appointment availability early.'] },
      { type: 'heading', level: 2, text: 'Documents and Appointments' },
      { type: 'paragraph', text: 'Document requirements and appointment processes can vary between missions and visa centres. Use the official country-specific checklist and make sure the purpose of travel matches every supporting document.' },
      { type: 'heading', level: 2, text: 'Travel Planning Tip' },
      { type: 'callout', tone: 'green', title: 'Keep your itinerary consistent', text: 'Dates, accommodation, transport and the destination stated in your application should tell the same story.' },
      { type: 'heading', level: 2, text: 'Latest Updates' },
      { type: 'paragraph', text: 'Rules may change. Check the relevant embassy or official visa centre before making an application or committing to travel.' },
    ],
  },
  {
    id: 'usa-appointments-2024',
    slug: 'usa-visa-appointment-wait-times-what-you-need-to-know',
    title: 'USA Visa Appointment Wait Times: What You Need to Know',
    excerpt: 'Understand how to plan around appointment availability and prepare for a US visa interview.',
    featuredImage: '/images/blogs/usa.png',
    heroImage: '/images/blogs/usa.png',
    imageAlt: 'Statue of Liberty and New York City skyline',
    category: 'Visa Update',
    country: 'United States',
    publishedAt: '2024-10-08',
    updatedAt: '2024-10-08',
    author: editorialTeam,
    readTime: 4,
    tags: ['USA', 'appointments', 'interview', 'visa process'],
    isPopular: true,
    seoTitle: 'US Visa Appointment Planning | Greenlight Travel Solutions',
    seoDescription: 'Plan for US visa appointment availability and prepare the information needed for an interview.',
    content: [
      { type: 'paragraph', text: 'Appointment availability is one of the first things to consider when planning US travel. It varies by location and visa category, so check the official scheduling system before setting firm travel dates.' },
      archiveNotice,
      { type: 'heading', level: 2, text: 'What Affects the Timeline?' },
      { type: 'list', items: ['Visa category and application location', 'Seasonal demand and appointment capacity', 'Additional administrative processing if required'] },
      { type: 'heading', level: 2, text: 'Prepare for the Interview' },
      { type: 'paragraph', text: 'Keep your application answers accurate and bring the documents requested by the official instructions. Be ready to explain the purpose and duration of your trip clearly.' },
      { type: 'heading', level: 2, text: 'Check Current Availability' },
      { type: 'paragraph', text: 'Published estimates are only a guide. Verify current wait times and scheduling options through the official US visa service for your application location.' },
    ],
  },
  {
    id: 'singapore-guide-2024',
    slug: 'singapore-travel-guide-2024-visa-attractions-and-tips',
    title: 'Singapore Travel Guide 2024: Visa, Attractions and Tips',
    excerpt: 'A practical guide to preparing travel documents and making the most of a Singapore visit.',
    featuredImage: '/images/blogs/singapore.png',
    heroImage: '/images/blogs/singapore.png',
    imageAlt: 'Marina Bay Sands and Singapore skyline at dusk',
    category: 'Travel Guide',
    country: 'Singapore',
    publishedAt: '2024-10-05',
    updatedAt: '2024-10-05',
    author: editorialTeam,
    readTime: 5,
    tags: ['Singapore', 'Asia', 'travel planning', 'attractions'],
    isPopular: true,
    seoTitle: 'Singapore Travel Planning Guide | Greenlight Travel Solutions',
    seoDescription: 'Plan your Singapore visit with practical document, itinerary and travel preparation tips.',
    content: [
      { type: 'paragraph', text: 'Singapore combines an easy-to-explore city layout with neighbourhoods, gardens and waterfront attractions. A little preparation helps you spend more time enjoying the trip.' },
      archiveNotice,
      { type: 'heading', level: 2, text: 'Plan Your Documents' },
      { type: 'paragraph', text: 'Check the current entry and visa rules for your passport before travel. Keep your travel details, return plans and accommodation information accessible.' },
      { type: 'heading', level: 2, text: 'Places to Explore' },
      { type: 'list', items: ['Marina Bay and the waterfront', 'Gardens by the Bay', 'Neighbourhood food and culture districts', 'Sentosa and coastal attractions'] },
      { type: 'heading', level: 2, text: 'Travel Tips' },
      { type: 'paragraph', text: 'Build a flexible itinerary, account for the tropical climate and check attraction hours before you go.' },
    ],
  },
  {
    id: 'uae-rules-2024',
    slug: 'uae-visa-new-rules-and-opportunities-in-2024',
    title: 'UAE Visa: New Rules and Opportunities in 2024',
    excerpt: 'Explore the visa categories and document questions to consider before a UAE trip.',
    featuredImage: '/images/blogs/dubai.png',
    heroImage: '/images/blogs/dubai.png',
    imageAlt: 'Burj Khalifa and Dubai skyline at sunset',
    category: 'Visa Update',
    country: 'United Arab Emirates',
    publishedAt: '2024-10-02',
    updatedAt: '2024-10-02',
    author: editorialTeam,
    readTime: 4,
    tags: ['UAE', 'Dubai', 'business travel', 'visa process'],
    isPopular: true,
    seoTitle: 'UAE Visa Planning Guide | Greenlight Travel Solutions',
    seoDescription: 'Explore common UAE visa planning questions and prepare for your travel application.',
    content: [
      { type: 'paragraph', text: 'The right UAE entry option depends on your passport, purpose of travel and intended stay. Review the current official criteria before selecting a category.' },
      archiveNotice,
      { type: 'heading', level: 2, text: 'Choose the Right Category' },
      { type: 'paragraph', text: 'Tourism, business and longer stays may follow different routes. Confirm the permitted activities and stay period for the option you are considering.' },
      { type: 'heading', level: 2, text: 'Prepare Your Application' },
      { type: 'list', checked: true, items: ['Check passport and photograph requirements.', 'Match the application details to your travel documents.', 'Confirm whether sponsorship or additional evidence is needed.', 'Allow time for review before departure.'] },
      { type: 'heading', level: 2, text: 'Latest Updates' },
      { type: 'paragraph', text: 'Use official UAE government and airline guidance for current entry conditions. Greenlight can help you understand the document checklist for your circumstances.' },
    ],
  },
  {
    id: 'thailand-checklist-2024',
    slug: 'thailand-travel-checklist-for-first-time-visitors',
    title: 'Thailand Travel Checklist for First-Time Visitors',
    excerpt: 'Everything to review before your first Thailand trip, from travel documents to an easy-going itinerary.',
    featuredImage: '/images/blogs/thailand.png',
    heroImage: '/images/blogs/thailand.png',
    imageAlt: 'Long-tail boat on turquoise water beneath Thailand limestone cliffs',
    category: 'Travel Tips',
    country: 'Thailand',
    publishedAt: '2024-09-28',
    updatedAt: '2024-09-28',
    author: editorialTeam,
    readTime: 4,
    tags: ['Thailand', 'Asia', 'first-time visitors', 'travel planning'],
    isPopular: false,
    seoTitle: 'Thailand First-Time Travel Checklist | Greenlight Travel Solutions',
    seoDescription: 'Prepare for a Thailand trip with a practical checklist for documents, plans and travel essentials.',
    content: [
      { type: 'paragraph', text: 'From city markets to island coastlines, Thailand offers many ways to travel. Use this checklist to organise the essentials while leaving room for discovery.' },
      archiveNotice,
      { type: 'heading', level: 2, text: 'Before You Leave' },
      { type: 'list', checked: true, items: ['Check current entry and visa rules for your passport.', 'Confirm passport validity and onward travel requirements.', 'Keep accommodation and transport details handy.', 'Review travel insurance and health guidance.'] },
      { type: 'heading', level: 2, text: 'Build a Comfortable Itinerary' },
      { type: 'paragraph', text: 'Give yourself enough time between destinations, especially when flights and ferries are involved. Check seasonal weather for the regions you plan to visit.' },
      { type: 'heading', level: 2, text: 'On Arrival' },
      { type: 'paragraph', text: 'Keep digital and offline copies of important documents and use official transport or reputable providers when arranging transfers.' },
    ],
  },
]

export const getBlogArticles = (): BlogArticle[] =>
  [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export const getBlogArticle = (slug: string): BlogArticle | undefined =>
  articles.find((article) => article.slug === slug)

export const searchBlogArticles = (query: string): BlogArticle[] => {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return getBlogArticles()

  return getBlogArticles().filter((article) => {
    const content = article.content.flatMap((block) => {
      if (block.type === 'list') return block.items
      if (block.type === 'callout') return [block.title, block.text ?? '', ...(block.items ?? [])]
      if (block.type === 'table') return [...block.headers, ...block.rows.flat()]
      if (block.type === 'image') return [block.alt, block.caption ?? '']
      if (block.type === 'link') return [block.label, block.text ?? '']
      return [block.text]
    })
    const searchable = [article.title, article.excerpt, article.country, article.category, ...article.tags, ...content].join(' ').toLocaleLowerCase()
    return terms.every((term) => searchable.includes(term))
  })
}

/** Editorial selections until a measured popularity signal is available. */
export const getPopularArticles = (limit = 5): BlogArticle[] =>
  getBlogArticles().filter((article) => article.isPopular).slice(0, limit)

export const getRelatedArticles = (current: BlogArticle, limit = 4): BlogArticle[] =>
  getBlogArticles()
    .filter((article) => article.id !== current.id)
    .map((article) => ({
      article,
      score: (article.country === current.country ? 6 : 0)
        + (article.category === current.category ? 3 : 0)
        + article.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || b.article.publishedAt.localeCompare(a.article.publishedAt))
    .slice(0, limit)
    .map(({ article }) => article)

export const formatBlogDate = (date: string): string =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))
