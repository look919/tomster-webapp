import { useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import { useRandomSong } from './useRandomSong'
import type { GameState, SearchSchema } from '@/types/game'

export const useGameLogic = () => {
  const searchParams = useSearch({ from: '/' })
  const playSong = (searchParams as SearchSchema).playSong
  const [gameState, setGameState] = useState<GameState>(
    playSong ? 'SONG-PLAYING' : 'SONG-SELECTION',
  )

  console.log('useGameLogic - playSong:', playSong)
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
