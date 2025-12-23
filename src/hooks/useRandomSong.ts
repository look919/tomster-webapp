import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export function useRandomSong(variant: string) {
  const queryClient = useQueryClient()

  const randomSongQuery = useQuery<Song, Error>({
    queryKey: ['song', variant],
    queryFn: () => fetchRandomSong({ variant }),
    staleTime: Infinity,
    retry: false,
  })

  const nextSongMutation = useMutation<Song, Error, FetchSongParams>({
    mutationFn: fetchRandomSong,
    onSuccess: (newSong) => {
      queryClient.setQueryData(['song', variant], newSong)
    },
  })

  const handleNextSong = () => {
    nextSongMutation.mutate({
      variant,
    })
  }

  const handleRetry = () => {
    randomSongQuery.refetch()
  }

  return {
    randomSongQuery,
    handleNextSong,
    handleRetry,
  }
}
