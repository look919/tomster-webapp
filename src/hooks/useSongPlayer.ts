import { useCallback, useEffect, useRef, useState } from 'react'
import type { YouTubePlayer } from 'react-youtube'
import type { Song } from '@/types/game'

// Set Media Session metadata to hide real song info from phone's media controls
function setMediaSessionMetadata() {
  if (!('mediaSession' in navigator)) return

  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'TOMSTER',
    artist: '???',
    album: 'Guess the song!',
  })
}

export function useSongPlayer(song: Song | undefined) {
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [volume, setVolume] = useState(50)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const pendingPlayRef = useRef(false)

  const onReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target
    playerRef.current.setVolume(volume)
    setReady(true)
  }

  // Called when YouTube player state changes
  const onStateChange = useCallback(
    (event: { data: number }) => {
      // State 1 = playing
      if (event.data === 1 && pendingPlayRef.current && song) {
        pendingPlayRef.current = false
        // Now the audio is actually playing, start the countdown timer
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
      }
    },
    [song],
  )

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
      pendingPlayRef.current = true
      // Set placeholder metadata to hide song info from phone's media controls
      setMediaSessionMetadata()
      playerRef.current.seekTo(song.clipStartTime, true)
      playerRef.current.playVideo()
    } catch (error) {
      console.error('Error playing video:', error)
      setPlaying(false)
      pendingPlayRef.current = false
    }
  }

  const handleStop = () => {
    pendingPlayRef.current = false
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
    pendingPlayRef.current = false

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
      // Clear media session metadata on cleanup
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null
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
    onStateChange,
  }
}
