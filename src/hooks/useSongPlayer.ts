import { useEffect, useRef, useState } from 'react'
import type { YouTubePlayer } from 'react-youtube'

interface Song {
  id: string
  title: string
  artists: Array<string>
  youtubeId: string
  clipDuration: number
  clipStartTime: number
  releaseYear: number
}

export function useSongPlayer(song: Song | undefined) {
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [volume, setVolume] = useState(50)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const onReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target
    playerRef.current.setVolume(volume)
    setReady(true)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume)
    }
  }

  const handlePlay = () => {
    if (!playerRef.current || !song || !ready) return

    try {
      setPlaying(true)
      setHasPlayed(true)
      playerRef.current.seekTo(song.clipStartTime, true)
      playerRef.current.playVideo()

      // Stop playback after clipDuration
      timerRef.current = setTimeout(() => {
        if (playerRef.current) {
          try {
            playerRef.current.pauseVideo()
          } catch (error) {
            console.error('Error pausing video:', error)
          }
        }
        setPlaying(false)
      }, song.clipDuration * 1000)
    } catch (error) {
      console.error('Error playing video:', error)
      setPlaying(false)
    }
  }

  const handleStop = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    if (playerRef.current) {
      try {
        playerRef.current.pauseVideo()
      } catch (error) {
        console.error('Error stopping video:', error)
      }
    }
    setPlaying(false)
  }

  // Cleanup timer on unmount or when song changes
  useEffect(() => {
    setReady(false)
    setPlaying(false)
    setHasPlayed(false)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      if (playerRef.current) {
        try {
          playerRef.current.pauseVideo()
        } catch (error) {
          // Player might be destroyed, ignore error
        }
      }
    }
  }, [song])

  return {
    playing,
    ready,
    hasPlayed,
    volume,
    handlePlay,
    handleStop,
    handleVolumeChange,
    onReady,
  }
}
