import { ArrowUpRight, Quote } from 'lucide-react'
import type { ReactNode } from 'react'
import './websiteCard.css'

export type WebsiteCardFamily = 'destination' | 'service' | 'feature' | 'testimonial' | 'information'

interface WebsiteCardProps {
  family: WebsiteCardFamily
  title: string
  description: string
  image?: string
  imageAlt?: string
  eyebrow?: string
  href?: string
  cta?: string
  avatar?: string
  icon?: ReactNode
}

/** Public card families share foundation tokens while keeping purpose-specific anatomy. */
export function WebsiteCard({ family, title, description, image, imageAlt = '', eyebrow, href, cta, avatar, icon }: WebsiteCardProps) {
  const action = href && cta ? <a className="glts-card-action" href={href}>{cta}<ArrowUpRight size={16} aria-hidden="true" /></a> : null
  return (
    <article className={`glts-card glts-card--${family}`}>
      {image && <img className="glts-card-image" src={image} alt={imageAlt} loading="lazy" />}
      <div className="glts-card-body">
        {icon && <span className="glts-card-icon" aria-hidden="true">{icon}</span>}
        {family === 'testimonial' && <Quote className="glts-card-quote" size={24} aria-hidden="true" />}
        {eyebrow && <span className="glts-card-eyebrow">{eyebrow}</span>}
        <h3>{title}</h3>
        <p>{description}</p>
        {avatar && <span className="glts-card-person">{avatar}</span>}
        {action}
      </div>
    </article>
  )
}
