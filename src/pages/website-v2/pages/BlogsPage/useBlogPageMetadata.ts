import { useEffect } from 'react'

export function useBlogPageMetadata(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title
    const existingDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const descriptionTag = existingDescription ?? document.createElement('meta')
    const previousDescription = existingDescription?.content
    if (!existingDescription) {
      descriptionTag.name = 'description'
      document.head.appendChild(descriptionTag)
    }
    document.title = title
    descriptionTag.content = description

    return () => {
      document.title = previousTitle
      if (existingDescription) descriptionTag.content = previousDescription ?? ''
      else descriptionTag.remove()
    }
  }, [title, description])
}
