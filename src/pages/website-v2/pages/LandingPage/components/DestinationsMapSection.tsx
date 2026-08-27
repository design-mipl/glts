import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent, type TransitionEvent } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { MapPin, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PublicContainer } from '../../../components/PublicContainer'
import footerWorldMapSrc from '../../../assets/footerWorldMap.svg'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
} from '@/shared/theme/publicBrand'

type CityGeoCoordinate = {
  lat: number
  lon: number
}

type CityDestination = CityGeoCoordinate & {
  countryId: string
  country: string
  city: string
  description: string
}

type CityMarker = CityDestination & {
  id: string
}

type GlobeLandPoint = CityGeoCoordinate & {
  seed: number
}

type GlobeProjection = {
  x: number
  y: number
  z: number
}

type ProjectedCityMarker = CityMarker & {
  left: number
  top: number
  z: number
  scale: number
  opacity: number
}

const MAP_DOT_COLOR = '#5A9A4E'
const OCEAN_INFO_300_RGB = '153, 175, 251'
const DEG_TO_RAD = Math.PI / 180
const GLOBE_RADIUS_RATIO = 0.455
const LAND_SAMPLE_WIDTH = 720
const LAND_SAMPLE_HEIGHT = 360
const LAND_SAMPLE_STEP = 5
const ROTATION_SPEED = 0.000024
const DRAG_ROTATION_MULTIPLIER = Math.PI * 1.55
const REVEAL_DURATION_MS = 1300
const MARKER_VISIBLE_Z = 0.5

const CITY_DESTINATIONS: CityDestination[] = [
  { countryId: '23', country: 'Canada', city: 'Toronto', lat: 43.6532, lon: -79.3832, description: 'Canada\'s largest city and a major international gateway.' },
  { countryId: '23', country: 'Canada', city: 'Vancouver', lat: 49.2827, lon: -123.1207, description: 'A leading Pacific coast destination framed by mountains.' },
  { countryId: '23', country: 'Canada', city: 'Montreal', lat: 45.5017, lon: -73.5673, description: 'A bilingual cultural hub known for arts and heritage.' },
  { countryId: '5', country: 'United States', city: 'New York', lat: 40.7128, lon: -74.006, description: 'A global centre for business, culture and tourism.' },
  { countryId: '5', country: 'United States', city: 'San Francisco', lat: 37.7749, lon: -122.4194, description: 'A major technology and tourism hub on the Pacific coast.' },
  { countryId: '26', country: 'Brazil', city: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, description: 'Brazil\'s iconic coastal city and tourism centre.' },
  { countryId: '26', country: 'Brazil', city: 'Sao Paulo', lat: -23.5505, lon: -46.6333, description: 'Brazil\'s largest city and principal business hub.' },
  { countryId: '26', country: 'Brazil', city: 'Brasilia', lat: -15.7939, lon: -47.8828, description: 'Brazil\'s modern capital and administrative centre.' },
  { countryId: '22', country: 'Morocco', city: 'Casablanca', lat: 33.5731, lon: -7.5898, description: 'Morocco\'s largest city and commercial gateway.' },
  { countryId: '22', country: 'Morocco', city: 'Marrakech', lat: 31.6295, lon: -7.9811, description: 'A historic destination known for markets and architecture.' },
  { countryId: '22', country: 'Morocco', city: 'Rabat', lat: 34.0209, lon: -6.8416, description: 'Morocco\'s capital and diplomatic centre.' },
  { countryId: '4', country: 'United Kingdom', city: 'London', lat: 51.5074, lon: -0.1278, description: 'The UK\'s capital and a global business and cultural centre.' },
  { countryId: '4', country: 'United Kingdom', city: 'Edinburgh', lat: 55.9533, lon: -3.1883, description: 'Scotland\'s historic capital and festival city.' },
  { countryId: '18', country: 'Netherlands', city: 'Amsterdam', lat: 52.3676, lon: 4.9041, description: 'The Netherlands\' cultural capital and international gateway.' },
  { countryId: '17', country: 'Belgium', city: 'Brussels', lat: 50.8503, lon: 4.3517, description: 'Belgium\'s capital and a major European institutions hub.' },
  { countryId: '14', country: 'France', city: 'Paris', lat: 48.8566, lon: 2.3522, description: 'France\'s capital and one of the world\'s leading destinations.' },
  { countryId: '14', country: 'France', city: 'Lyon', lat: 45.764, lon: 4.8357, description: 'A major French centre for business, culture and cuisine.' },
  { countryId: '10', country: 'Kenya', city: 'Nairobi', lat: -1.2921, lon: 36.8219, description: 'Kenya\'s capital and East Africa\'s principal business hub.' },
  { countryId: '10', country: 'Kenya', city: 'Mombasa', lat: -4.0435, lon: 39.6682, description: 'Kenya\'s historic Indian Ocean port city.' },
  { countryId: '25', country: 'India', city: 'Delhi', lat: 28.6139, lon: 77.209, description: 'India\'s capital and a major international arrival point.' },
  { countryId: '25', country: 'India', city: 'Mumbai', lat: 19.076, lon: 72.8777, description: 'India\'s financial capital and busiest commercial gateway.' },
  { countryId: '25', country: 'India', city: 'Bengaluru', lat: 12.9716, lon: 77.5946, description: 'India\'s leading technology and innovation centre.' },
  { countryId: '13', country: 'China', city: 'Beijing', lat: 39.9042, lon: 116.4074, description: 'China\'s capital and principal cultural and political centre.' },
  { countryId: '13', country: 'China', city: 'Shanghai', lat: 31.2304, lon: 121.4737, description: 'China\'s largest city and global financial hub.' },
  { countryId: '13', country: 'China', city: 'Guangzhou', lat: 23.1291, lon: 113.2644, description: 'A major southern Chinese trade and manufacturing centre.' },
  { countryId: '21', country: 'South Korea', city: 'Seoul', lat: 37.5665, lon: 126.978, description: 'South Korea\'s capital and largest metropolitan destination.' },
  { countryId: '21', country: 'South Korea', city: 'Busan', lat: 35.1796, lon: 129.0756, description: 'South Korea\'s leading port and coastal destination.' },
  { countryId: '2', country: 'Japan', city: 'Tokyo', lat: 35.6762, lon: 139.6503, description: 'Japan\'s capital and primary international gateway.' },
  { countryId: '2', country: 'Japan', city: 'Osaka', lat: 34.6937, lon: 135.5023, description: 'A major Japanese business, food and entertainment centre.' },
  { countryId: '16', country: 'Taiwan', city: 'Taipei', lat: 25.033, lon: 121.5654, description: 'Taiwan\'s capital and main international gateway.' },
  { countryId: '16', country: 'Taiwan', city: 'Kaohsiung', lat: 22.6273, lon: 120.3014, description: 'Taiwan\'s principal southern port city.' },
  { countryId: '20', country: 'Philippines', city: 'Manila', lat: 14.5995, lon: 120.9842, description: 'The Philippines\' capital and primary travel gateway.' },
  { countryId: '20', country: 'Philippines', city: 'Cebu', lat: 10.3157, lon: 123.8854, description: 'A central Philippine hub for beaches, business and heritage.' },
  { countryId: '6', country: 'Singapore', city: 'Singapore', lat: 1.3521, lon: 103.8198, description: 'A major Asian aviation, business and tourism hub.' },
  { countryId: '15', country: 'Australia', city: 'Sydney', lat: -33.8688, lon: 151.2093, description: 'Australia\'s best-known harbour city and travel gateway.' },
  { countryId: '15', country: 'Australia', city: 'Melbourne', lat: -37.8136, lon: 144.9631, description: 'A leading Australian centre for culture, study and business.' },
  { countryId: '15', country: 'Australia', city: 'Perth', lat: -31.9523, lon: 115.8613, description: 'Western Australia\'s capital and Indian Ocean gateway.' },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function projectGlobeCoordinate(coordinate: CityGeoCoordinate, rotation: number): GlobeProjection {
  const latitude = clamp(coordinate.lat, -89.9, 89.9) * DEG_TO_RAD
  const longitude = coordinate.lon * DEG_TO_RAD + rotation
  const cosLatitude = Math.cos(latitude)

  return {
    x: cosLatitude * Math.sin(longitude),
    y: -Math.sin(latitude),
    z: cosLatitude * Math.cos(longitude),
  }
}

function projectCityMarker(marker: CityMarker, rotation: number): ProjectedCityMarker | null {
  const projection = projectGlobeCoordinate(marker, rotation)
  if (projection.z <= MARKER_VISIBLE_Z) return null

  const edgeOpacity = clamp((projection.z - MARKER_VISIBLE_Z) / 0.2, 0, 1)

  return {
    ...marker,
    left: 50 + projection.x * GLOBE_RADIUS_RATIO * 100,
    top: 50 + projection.y * GLOBE_RADIUS_RATIO * 100,
    z: projection.z,
    scale: 0.78 + projection.z * 0.34,
    opacity: edgeOpacity,
  }
}

function buildCityMarkers(): CityMarker[] {
  const countryCounts = new Map<string, number>()

  return CITY_DESTINATIONS.flatMap(destination => {
    const count = countryCounts.get(destination.countryId) ?? 0
    if (count >= 5) return []

    countryCounts.set(destination.countryId, count + 1)
    return [{
      ...destination,
      id: `${destination.countryId}-${destination.city.toLowerCase().replace(/\s+/g, '-')}`,
    }]
  })
}

function sampleLandDots(image: HTMLImageElement): GlobeLandPoint[] {
  const canvas = document.createElement('canvas')
  canvas.width = LAND_SAMPLE_WIDTH
  canvas.height = LAND_SAMPLE_HEIGHT
  const context = canvas.getContext('2d', { willReadFrequently: true })

  if (!context) return []

  context.clearRect(0, 0, LAND_SAMPLE_WIDTH, LAND_SAMPLE_HEIGHT)
  context.drawImage(image, 0, 0, LAND_SAMPLE_WIDTH, LAND_SAMPLE_HEIGHT)
  const pixels = context.getImageData(0, 0, LAND_SAMPLE_WIDTH, LAND_SAMPLE_HEIGHT).data
  const points: GlobeLandPoint[] = []

  for (let y = 2; y < LAND_SAMPLE_HEIGHT; y += LAND_SAMPLE_STEP) {
    for (let x = 2; x < LAND_SAMPLE_WIDTH; x += LAND_SAMPLE_STEP) {
      const alpha = pixels[(y * LAND_SAMPLE_WIDTH + x) * 4 + 3]
      if (alpha < 24) continue

      const seed = ((x * 73856093) ^ (y * 19349663)) >>> 0
      const jitterX = (((seed % 1000) / 1000) - 0.5) * 0.45
      const jitterY = ((((seed >> 10) % 1000) / 1000) - 0.5) * 0.45
      const lon = ((x + jitterX) / LAND_SAMPLE_WIDTH) * 360 - 180
      const lat = 90 - ((y + jitterY) / LAND_SAMPLE_HEIGHT) * 180

      points.push({ lat, lon, seed })
    }
  }

  return points
}

function drawOceanWaves(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
) {
  context.save()
  context.strokeStyle = `rgba(${OCEAN_INFO_300_RGB}, 0.24)`
  context.lineWidth = Math.max(0.55, radius * 0.00125)
  context.lineCap = 'round'
  context.lineJoin = 'round'

  for (let index = -5; index <= 5; index += 1) {
    const y = centerY + radius * (index * 0.15)
    const edgeCompression = 1 - Math.min(0.72, Math.abs(index) * 0.11)
    const startX = centerX - radius * 0.88 * edgeCompression
    const endX = centerX + radius * 0.88 * edgeCompression
    const wave = radius * (0.018 + (Math.abs(index) % 3) * 0.004)

    context.beginPath()
    context.moveTo(startX, y)
    context.bezierCurveTo(
      centerX - radius * 0.52 * edgeCompression,
      y - wave,
      centerX - radius * 0.2 * edgeCompression,
      y + wave,
      centerX + radius * 0.08 * edgeCompression,
      y,
    )
    context.bezierCurveTo(
      centerX + radius * 0.36 * edgeCompression,
      y - wave,
      centerX + radius * 0.58 * edgeCompression,
      y + wave,
      endX,
      y - wave * 0.15,
    )
    context.stroke()
  }

  context.restore()
}

function drawGlobe(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  landDots: GlobeLandPoint[],
  rotation: number,
  revealProgress: number,
  hasMapEntered: boolean,
) {
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) * GLOBE_RADIUS_RATIO
  const revealEdge = revealProgress * 1.14 - 0.07

  context.clearRect(0, 0, width, height)

  context.save()
  context.shadowColor = 'rgba(8, 32, 55, 0.035)'
  context.shadowBlur = radius * 0.055
  context.shadowOffsetY = radius * 0.018
  context.beginPath()
  context.arc(centerX, centerY, radius, 0, Math.PI * 2)
  context.fillStyle = 'rgba(251, 254, 255, 0.99)'
  context.fill()
  context.restore()

  context.save()
  context.beginPath()
  context.arc(centerX, centerY, radius, 0, Math.PI * 2)
  context.clip()

  const oceanGradient = context.createRadialGradient(
    centerX - radius * 0.36,
    centerY - radius * 0.4,
    radius * 0.08,
    centerX,
    centerY,
    radius,
  )
  oceanGradient.addColorStop(0, `rgba(${OCEAN_INFO_300_RGB}, 0.08)`)
  oceanGradient.addColorStop(0.58, `rgba(${OCEAN_INFO_300_RGB}, 0.16)`)
  oceanGradient.addColorStop(1, `rgba(${OCEAN_INFO_300_RGB}, 0.25)`)
  context.fillStyle = oceanGradient
  context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2)

  drawOceanWaves(context, centerX, centerY, radius)

  landDots.forEach(point => {
    const projection = projectGlobeCoordinate(point, rotation)
    if (projection.z <= -0.04) return

    const screenX = centerX + projection.x * radius
    const screenY = centerY + projection.y * radius
    const edgeFade = clamp(projection.z * 2.8, 0, 1)
    const depthScale = 0.72 + projection.z * 0.44
    const dotRadius = Math.max(0.78, radius * 0.0032 * depthScale)
    const revealDiagonal = (
      ((screenX - (centerX - radius)) / (radius * 2)) +
      ((screenY - (centerY - radius)) / (radius * 2))
    ) / 2

    context.beginPath()
    context.arc(screenX, screenY, dotRadius, 0, Math.PI * 2)
    context.fillStyle = `rgba(43, 63, 82, ${0.14 * edgeFade})`
    context.fill()

    if (hasMapEntered && revealEdge >= revealDiagonal) {
      context.beginPath()
      context.arc(screenX, screenY, dotRadius * 1.03, 0, Math.PI * 2)
      context.fillStyle = `rgba(115, 192, 100, ${0.86 * edgeFade})`
      context.fill()
    }
  })

  const depthGradient = context.createRadialGradient(
    centerX - radius * 0.36,
    centerY - radius * 0.45,
    radius * 0.18,
    centerX,
    centerY,
    radius,
  )
  depthGradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
  depthGradient.addColorStop(0.68, 'rgba(255, 255, 255, 0.02)')
  depthGradient.addColorStop(1, 'rgba(8, 32, 55, 0.09)')
  context.fillStyle = depthGradient
  context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2)

  context.restore()

  context.save()
  context.beginPath()
  context.arc(centerX, centerY, radius, 0, Math.PI * 2)
  context.strokeStyle = 'rgba(115, 192, 100, 0.08)'
  context.lineWidth = Math.max(0.75, radius * 0.0016)
  context.stroke()
  context.restore()
}

export function DestinationsMapSection() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rotationRef = useRef(-18 * DEG_TO_RAD)
  const revealStartedAtRef = useRef<number | null>(null)
  const hasMapEnteredRef = useRef(false)
  const prefersReducedMotionRef = useRef(false)
  const isDraggingRef = useRef(false)
  const dragPointerIdRef = useRef<number | null>(null)
  const previousDragXRef = useRef(0)
  const previousDragTimeRef = useRef(0)
  const dragVelocityRef = useRef(0)
  const dragDistanceRef = useRef(0)
  const markerRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const markerButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const latestMarkerPositionsRef = useRef<Map<string, ProjectedCityMarker>>(new Map())
  const hoveredPinIdRef = useRef<string | null>(null)
  const zoomPinIdRef = useRef<string | null>(null)
  const zoomTooltipRef = useRef<HTMLDivElement | null>(null)
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null)
  const [zoomPinId, setZoomPinId] = useState<string | null>(null)
  const [isMapZoomed, setIsMapZoomed] = useState(false)
  const [isGlobeDragging, setIsGlobeDragging] = useState(false)
  const [hasMapEntered, setHasMapEntered] = useState(false)
  const [landDots, setLandDots] = useState<GlobeLandPoint[]>([])
  const [zoomOrigin, setZoomOrigin] = useState({ left: 50, top: 50 })
  const cityMarkers = useMemo(() => buildCityMarkers(), [])
  const zoomMarker = useMemo(
    () => cityMarkers.find(marker => marker.id === zoomPinId) ?? null,
    [cityMarkers, zoomPinId],
  )

  const updateMarkerPositions = useCallback((rotation: number) => {
    const nextMarkerPositions = new Map<string, ProjectedCityMarker>()

    cityMarkers.forEach(marker => {
      const projectedMarker = projectCityMarker(marker, rotation)
      const markerNode = markerRefs.current.get(marker.id)
      const buttonNode = markerButtonRefs.current.get(marker.id)

      if (!projectedMarker) {
        if (markerNode) {
          markerNode.style.opacity = '0'
          markerNode.style.pointerEvents = 'none'
          markerNode.style.zIndex = '0'
        }
        return
      }

      nextMarkerPositions.set(marker.id, projectedMarker)

      if (markerNode) {
        markerNode.style.left = `${projectedMarker.left}%`
        markerNode.style.top = `${projectedMarker.top}%`
        markerNode.style.opacity = `${projectedMarker.opacity}`
        markerNode.style.pointerEvents = projectedMarker.opacity > 0.18 ? 'auto' : 'none'
        markerNode.style.zIndex = hoveredPinIdRef.current === marker.id
          ? '10'
          : `${Math.round(projectedMarker.z * 10)}`
      }

      if (buttonNode) {
        buttonNode.style.transform = `translateX(-50%) scale(${projectedMarker.scale})`
      }
    })

    latestMarkerPositionsRef.current = nextMarkerPositions

    const activeMarkerId = zoomPinIdRef.current
    const activeMarker = activeMarkerId ? nextMarkerPositions.get(activeMarkerId) ?? null : null
    const tooltipNode = zoomTooltipRef.current

    if (!tooltipNode) return

    if (activeMarker && hoveredPinIdRef.current === activeMarker.id) {
      tooltipNode.style.left = `${activeMarker.left}%`
      tooltipNode.style.top = `${activeMarker.top}%`
      tooltipNode.style.opacity = '1'
      tooltipNode.setAttribute('aria-hidden', 'false')
      return
    }

    tooltipNode.style.opacity = '0'
    tooltipNode.setAttribute('aria-hidden', 'true')
  }, [cityMarkers])

  useEffect(() => {
    hasMapEnteredRef.current = hasMapEntered
  }, [hasMapEntered])

  useEffect(() => {
    hoveredPinIdRef.current = hoveredPinId
    updateMarkerPositions(rotationRef.current)
  }, [hoveredPinId, updateMarkerPositions])

  useEffect(() => {
    zoomPinIdRef.current = zoomPinId
    updateMarkerPositions(rotationRef.current)
  }, [zoomPinId, updateMarkerPositions])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => {
      prefersReducedMotionRef.current = mediaQuery.matches
    }

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (hasMapEntered) return undefined

    const section = sectionRef.current
    if (!section || typeof window.IntersectionObserver === 'undefined') {
      const frameId = window.requestAnimationFrame(() => setHasMapEntered(true))
      return () => window.cancelAnimationFrame(frameId)
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setHasMapEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.28 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [hasMapEntered])

  useEffect(() => {
    let cancelled = false
    const image = new Image()

    image.onload = () => {
      if (!cancelled) {
        setLandDots(sampleLandDots(image))
      }
    }

    image.src = footerWorldMapSrc

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || landDots.length === 0) return undefined

    let animationFrame = 0
    let previousTime = performance.now()

    const renderGlobe = (time: number) => {
      const width = Math.max(1, canvas.clientWidth)
      const height = Math.max(1, canvas.clientHeight)
      const pixelRatio = window.devicePixelRatio || 1
      const canvasWidth = Math.floor(width * pixelRatio)
      const canvasHeight = Math.floor(height * pixelRatio)

      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth
        canvas.height = canvasHeight
      }

      const context = canvas.getContext('2d')
      if (!context) return

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

      const elapsed = time - previousTime
      previousTime = time

      if (
        hasMapEnteredRef.current &&
        !prefersReducedMotionRef.current &&
        !isDraggingRef.current
      ) {
        rotationRef.current += elapsed * ROTATION_SPEED
      }

      if (!isDraggingRef.current && Math.abs(dragVelocityRef.current) > 0.000002) {
        rotationRef.current += dragVelocityRef.current * elapsed
        dragVelocityRef.current *= Math.pow(0.965, elapsed / 16.67)

        if (Math.abs(dragVelocityRef.current) < 0.000002) {
          dragVelocityRef.current = 0
        }
      }

      if (!hasMapEnteredRef.current) {
        revealStartedAtRef.current = null
      } else if (revealStartedAtRef.current === null) {
        revealStartedAtRef.current = time
      }

      const revealProgress = prefersReducedMotionRef.current || !revealStartedAtRef.current
        ? Number(hasMapEnteredRef.current)
        : clamp((time - revealStartedAtRef.current) / REVEAL_DURATION_MS, 0, 1)

      drawGlobe(
        context,
        width,
        height,
        landDots,
        rotationRef.current,
        revealProgress,
        hasMapEnteredRef.current,
      )

      updateMarkerPositions(rotationRef.current)

      animationFrame = window.requestAnimationFrame(renderGlobe)
    }

    animationFrame = window.requestAnimationFrame(renderGlobe)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [landDots, updateMarkerPositions])

  const handlePinEnter = (pin: CityMarker) => {
    const projectedPin = latestMarkerPositionsRef.current.get(pin.id)
      ?? projectCityMarker(pin, rotationRef.current)

    hoveredPinIdRef.current = pin.id
    zoomPinIdRef.current = pin.id

    if (projectedPin) {
      setZoomOrigin({ left: projectedPin.left, top: projectedPin.top })
    }

    setHoveredPinId(pin.id)
    setZoomPinId(pin.id)
    setIsMapZoomed(true)
    updateMarkerPositions(rotationRef.current)
  }

  const handlePinLeave = () => {
    hoveredPinIdRef.current = null
    setHoveredPinId(null)
    setIsMapZoomed(false)
    updateMarkerPositions(rotationRef.current)
  }

  const handleZoomTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName === 'transform' && !isMapZoomed) {
      zoomPinIdRef.current = null
      setZoomPinId(null)
    }
  }

  const handleGlobePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return

    isDraggingRef.current = true
    dragPointerIdRef.current = event.pointerId
    previousDragXRef.current = event.clientX
    previousDragTimeRef.current = performance.now()
    dragVelocityRef.current = 0
    dragDistanceRef.current = 0
    setIsGlobeDragging(true)

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleGlobePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || dragPointerIdRef.current !== event.pointerId) return

    const now = performance.now()
    const deltaX = event.clientX - previousDragXRef.current
    const elapsed = Math.max(1, now - previousDragTimeRef.current)
    const width = Math.max(1, event.currentTarget.clientWidth)
    const rotationDelta = (deltaX / width) * DRAG_ROTATION_MULTIPLIER

    rotationRef.current += rotationDelta
    dragVelocityRef.current = clamp(rotationDelta / elapsed, -0.009, 0.009)
    dragDistanceRef.current += Math.abs(deltaX)
    previousDragXRef.current = event.clientX
    previousDragTimeRef.current = now
    updateMarkerPositions(rotationRef.current)
    event.preventDefault()
  }

  const handleGlobePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (dragPointerIdRef.current !== event.pointerId) return

    isDraggingRef.current = false
    dragPointerIdRef.current = null
    setIsGlobeDragging(false)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleMarkerClick = (countryId: string) => {
    if (dragDistanceRef.current > 6) return
    navigate(`/countries/${countryId}`)
  }

  return (
    <Box
      ref={sectionRef}
      component="section"
      aria-labelledby="destinations-map-heading"
      sx={{
        py: landingSectionPy,
        bgcolor: colors.white,
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
        '@keyframes mapPinAppear': {
          '0%': {
            opacity: 0,
            transform: 'translateX(-50%) scale(0.82)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(-50%) scale(1)',
          },
        },
      }}
    >
      <PublicContainer variant="hero">
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: 640,
            mx: 'auto',
            mb: landingSectionHeaderMb,
          }}
        >
          <Typography
            id="destinations-map-heading"
            component="h2"
            sx={{
              fontFamily: publicFonts.display,
              fontWeight: 700,
              fontSize: { xs: '28px', md: '36px', lg: '40px' },
              lineHeight: 1.15,
              color: colors.navy,
              letterSpacing: '-0.3px',
              mb: 1.25,
            }}
          >
            Visa destinations worldwide
          </Typography>
          <Typography
            sx={{
              fontFamily: publicFonts.body,
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.6,
            }}
          >
            Explore popular visa destinations around the world.
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
            mt: { xs: 2, md: 5 },
            minHeight: { xs: 450, sm: 560, md: 710, lg: 790 },
            display: 'grid',
            placeItems: 'center',
            userSelect: 'none',
            overflow: 'visible',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: { xs: 'min(90vw, 390px)', sm: 500, md: 640, lg: 720 },
              aspectRatio: '1 / 1',
              overflow: 'visible',
            }}
          >
            <Box
              onTransitionEnd={handleZoomTransitionEnd}
              onPointerDown={handleGlobePointerDown}
              onPointerMove={handleGlobePointerMove}
              onPointerUp={handleGlobePointerEnd}
              onPointerCancel={handleGlobePointerEnd}
              sx={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                overflow: 'hidden',
                cursor: isGlobeDragging ? 'grabbing' : 'grab',
                touchAction: 'pan-y',
                transform: isMapZoomed && zoomMarker ? 'scale(1.18)' : 'scale(1)',
                transformOrigin: zoomMarker ? `${zoomOrigin.left}% ${zoomOrigin.top}%` : '50% 50%',
                transition: 'transform 540ms cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform',
                filter: 'drop-shadow(0 10px 22px rgba(8, 32, 55, 0.055))',
                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',
                },
              }}
            >
              <Box
                component="canvas"
                ref={canvasRef}
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 1,
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 3,
                  pointerEvents: 'none',
                }}
              >
                {cityMarkers.map((pin, index) => (
                  <Box
                    key={pin.id}
                    ref={(node: HTMLDivElement | null) => {
                      if (node) {
                        markerRefs.current.set(pin.id, node)
                      } else {
                        markerRefs.current.delete(pin.id)
                      }
                    }}
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: 0,
                      height: 0,
                      zIndex: 0,
                      opacity: 0,
                      pointerEvents: 'none',
                      transition: 'opacity 100ms linear',
                      willChange: 'left, top, opacity, z-index',
                    }}
                  >
                    <Box
                      component="button"
                      type="button"
                      ref={(node: HTMLButtonElement | null) => {
                        if (node) {
                          markerButtonRefs.current.set(pin.id, node)
                        } else {
                          markerButtonRefs.current.delete(pin.id)
                        }
                      }}
                      aria-label={`${pin.city}, ${pin.country}`}
                      onClick={() => handleMarkerClick(pin.countryId)}
                      onPointerEnter={() => handlePinEnter(pin)}
                      onPointerLeave={handlePinLeave}
                      onFocus={() => handlePinEnter(pin)}
                      onBlur={handlePinLeave}
                      sx={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: { xs: 32, md: 36 },
                        height: { xs: 32, md: 36 },
                        p: 0,
                        m: 0,
                        border: 'none',
                        borderRadius: '50%',
                        bgcolor: 'transparent',
                        cursor: 'pointer',
                        transform: 'translateX(-50%) scale(1)',
                        transformOrigin: '50% 100%',
                        '&:hover, &:focus-visible': {
                          outline: 'none',
                          '& .map-pin-visual': {
                            transform: 'translateX(-50%) scale(1.08)',
                            bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.28)`,
                            boxShadow: `0 0 0 5px rgba(${brandPrimaryGreenRgb}, 0.14)`,
                          },
                        },
                        '@media (prefers-reduced-motion: reduce)': {
                          transition: 'none',
                          '& .map-pin-visual': {
                            animation: 'none',
                            opacity: 1,
                            transition: 'none',
                          },
                        },
                      }}
                    >
                      <Box
                        className="map-pin-visual"
                        sx={{
                          position: 'absolute',
                          left: '50%',
                          bottom: 0,
                          width: { xs: 17, sm: 20, md: 24 },
                          height: { xs: 17, sm: 20, md: 24 },
                          borderRadius: '50%',
                          bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.18)`,
                          display: 'grid',
                          placeItems: 'center',
                          boxShadow: {
                            xs: `0 0 0 3px rgba(${brandPrimaryGreenRgb}, 0.09)`,
                            md: `0 0 0 4px rgba(${brandPrimaryGreenRgb}, 0.1)`,
                          },
                          opacity: 0,
                          transform: 'translateX(-50%) scale(1)',
                          transformOrigin: '50% 100%',
                          animation: `mapPinAppear 360ms cubic-bezier(0.22, 1, 0.36, 1) ${180 + index * 105}ms both`,
                          transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), background-color 240ms ease, box-shadow 240ms ease',
                          '& svg': {
                            width: { xs: 10, sm: 11, md: 14 },
                            height: { xs: 10, sm: 11, md: 14 },
                          },
                        }}
                      >
                        <MapPin
                          size={14}
                          color={MAP_DOT_COLOR}
                          fill={MAP_DOT_COLOR}
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {zoomMarker && (
              <Box
                ref={zoomTooltipRef}
                aria-hidden={hoveredPinId !== zoomMarker.id}
                sx={{
                  position: 'absolute',
                  left: `${zoomOrigin.left}%`,
                  top: `${zoomOrigin.top}%`,
                  zIndex: 8,
                  px: 0.9,
                  py: 0.4,
                  borderRadius: '8px',
                  bgcolor: colors.white,
                  border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.22)`,
                  boxShadow: `0 8px 22px rgba(8, 32, 55, 0.16)`,
                  pointerEvents: 'none',
                  opacity: hoveredPinId === zoomMarker.id ? 1 : 0,
                  transform: hoveredPinId === zoomMarker.id
                    ? 'translate(-50%, calc(-100% - 18px)) scale(1)'
                    : 'translate(-50%, calc(-100% - 10px)) scale(0.94)',
                  transformOrigin: '50% 100%',
                  transition: 'opacity 150ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
                  willChange: 'left, top, opacity, transform',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: '50%',
                    bottom: -4,
                    width: 7,
                    height: 7,
                    bgcolor: colors.white,
                    borderRight: `1px solid rgba(${brandPrimaryGreenRgb}, 0.22)`,
                    borderBottom: `1px solid rgba(${brandPrimaryGreenRgb}, 0.22)`,
                    transform: 'translateX(-50%) rotate(45deg)',
                  },
                  '@media (prefers-reduced-motion: reduce)': {
                    transition: 'none',
                  },
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    display: 'block',
                    fontFamily: publicFonts.body,
                    fontWeight: 800,
                    fontSize: '12px',
                    lineHeight: 1.2,
                    color: colors.navy,
                    letterSpacing: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {zoomMarker.city}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, md: 3 } }}>
          <Button
            onClick={() => navigate('/countries')}
            endIcon={<ArrowRight size={16} />}
            sx={{
              textTransform: 'none',
              fontFamily: publicFonts.body,
              fontWeight: 700,
              fontSize: '14px',
              color: colors.navy,
              px: 2,
              py: 1,
              borderRadius: '10px',
              '&:hover': {
                bgcolor: colors.greenMuted,
              },
            }}
          >
            Browse all destinations
          </Button>
        </Box>
      </PublicContainer>
    </Box>
  )
}
