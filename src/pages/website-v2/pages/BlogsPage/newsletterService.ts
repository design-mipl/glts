/** Optional publishing integration. Configure VITE_NEWSLETTER_ENDPOINT when an API is available. */
export async function subscribeToNewsletter(email: string): Promise<void> {
  const endpoint = import.meta.env.VITE_NEWSLETTER_ENDPOINT
  if (!endpoint) {
    throw new Error('Newsletter signup is not available yet. Please try again later.')
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    throw new Error('We could not subscribe you right now. Please try again later.')
  }
}
