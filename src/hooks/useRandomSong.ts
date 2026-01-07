import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useGameVariant } from './useGameVariant'
import type { Song } from '@/api/game'
import type { SearchSchema } from '@/types/game'
import { fetchRandomSong } from '@/api/game'

export function useRandomSong() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const searchParams = useSearch({ from: '/' })
  const playSong = (searchParams as SearchSchema).playSong
  const [fetchId, setFetchId] = useState(playSong ? 1 : 0)
  const variant = useGameVariant()

  const randomSongQuery = useQuery<Song, Error>({
    queryKey: ['song', variant, fetchId],
    queryFn: () => fetchRandomSong({ variant }),
    staleTime: Infinity,
    retry: false,
    enabled: fetchId > 0, // Only fetch when user explicitly requests a song
  })

  const handleGetNextSong = (newVariant: string | null) => {
    // Remove old query data before fetching new song
    queryClient.removeQueries({ queryKey: ['song', variant, fetchId] })

    setFetchId((prev) => prev + 1)
    navigate({
      to: '/',
      search: {
        variant: newVariant ?? variant,
      },
      // reloadDocument: variant === newVariant,
    })
  }

  const handleRetry = () => {
    randomSongQuery.refetch()
  }

  return {
    randomSongQuery,
    handleGetNextSong,
    handleRetry,
  }
}
