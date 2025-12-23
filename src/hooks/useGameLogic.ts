import { useEffect, useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import z from 'zod'
import { useRandomSong } from './useRandomSong'

export const searchSchema = z.object({
  variant: z.string().optional(),
})

type SearchSchema = z.infer<typeof searchSchema>

export const useGameLogic = () => {
  const searchParams = useSearch({ from: '/' })
  const variant =
    (searchParams as SearchSchema).variant || 'RANDOM-RANDOM-RANDOM-RANDOM'

  const { handleNextSong, handleRetry, randomSongQuery } =
    useRandomSong(variant)

  const [isSongRevealed, setIsSongRevealed] = useState(false)

  useEffect(() => {
    // Reset song revealed state when a new song is loaded
    setIsSongRevealed(false)
  }, [randomSongQuery.data])

  const handleReportAndSkip = async () => {
    if (!randomSongQuery.data) return

    try {
      await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/api/game/songs/${randomSongQuery.data.id}/report`,
        {
          method: 'POST',
        },
      )
    } catch (error) {
      console.error('Failed to report song:', error)
    }

    handleNextSong()
  }

  return {
    variant,
    randomSongQuery,
    isSongRevealed,
    setIsSongRevealed,
    handleRetry,
    handleReportAndSkip,
  }
}
