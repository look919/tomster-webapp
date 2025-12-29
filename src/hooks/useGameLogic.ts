import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRandomSong } from './useRandomSong'
import type { GameState } from '@/types/game'

async function reportSong(songId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_APP_BASE_URL}/api/game/songs/${songId}/report`,
    {
      method: 'POST',
    },
  )

  if (!response.ok) {
    throw new Error('Failed to report song')
  }
}

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>('SONG-SELECTION')

  const { handleGetNextSong, handleRetry, randomSongQuery } = useRandomSong()

  const handleReportAndSkip = () => {
    if (!randomSongQuery.data) return
    reportSongMutation.mutate(randomSongQuery.data.id)
  }

  const handleRevealSong = () => {
    setGameState('SONG-REVEALED')
  }

  const handleSelectNextSong = () => {
    setGameState('SONG-SELECTION')
  }

  const handleGetNewSong = (newVariant: string | null) => {
    handleGetNextSong(newVariant)
    setGameState('SONG-PLAYING')
  }

  const reportSongMutation = useMutation({
    mutationFn: reportSong,
    onSuccess: () => {
      handleGetNewSong(null)
    },
    onError: (error) => {
      console.error('Failed to report song:', error)
      handleGetNewSong(null)
    },
  })

  return {
    gameState,
    randomSongQuery,
    handleRevealSong,
    handleSelectNextSong,
    handleGetNewSong,
    handleRetry,
    handleReportAndSkip,
  }
}
