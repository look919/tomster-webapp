import { useState } from 'react'
import { useRandomSong } from './useRandomSong'
import type { GameState } from '@/types/game'

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>('SONG-SELECTION')

  const { handleGetNextSong, handleRetry, randomSongQuery } = useRandomSong()

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

  return {
    gameState,
    randomSongQuery,
    handleRevealSong,
    handleSelectNextSong,
    handleGetNewSong,
    handleRetry,
  }
}
