import { useCallback, useEffect, useRef, useState } from 'react'

export type CameraStatus = 'idle' | 'starting' | 'live' | 'unavailable' | 'denied'

export function useCameraCapture(options?: { facingMode?: 'user' | 'environment' }) {
  const facingMode = options?.facingMode ?? 'user'
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<CameraStatus>('idle')

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => stopTrack(track))
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setStatus('idle')
  }, [])

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unavailable')
      return
    }
    setStatus('starting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStatus('live')
    } catch (error) {
      setStatus(error instanceof DOMException && error.name === 'NotAllowedError' ? 'denied' : 'unavailable')
    }
  }, [facingMode])

  const capture = useCallback((): string | undefined => {
    const video = videoRef.current
    if (!video || status !== 'live') return undefined
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 960
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.9)
  }, [status])

  useEffect(() => stop, [stop])

  return { videoRef, status, start, stop, capture }
}

function stopTrack(track: MediaStreamTrack) {
  track.stop()
}
