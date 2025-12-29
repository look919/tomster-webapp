import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useGameVariant } from './useGameVariant'

interface Song {
  id: string
  title: string
  artists: Array<string>
  youtubeId: string
  clipDuration: number
  clipStartTime: number
  releaseYear: number
}

interface FetchSongParams {
  variant: string
}

async function fetchRandomSong({ variant }: FetchSongParams): Promise<Song> {
  const url = `${import.meta.env.VITE_APP_BASE_URL}/api/game/play/${variant}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch song')
  }

  return response.json()
}

export function useRandomSong() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [fetchId, setFetchId] = useState(0)
  const variant = useGameVariant()

  const randomSongQuery = useQuery<Song, Error>({
    queryKey: ['song', variant, fetchId],
    queryFn: () => fetchRandomSong({ variant }),
    staleTime: Infinity,
    retry: false,
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
