import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalStorage } from 'usehooks-ts'

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
  category?: string
  difficulty?: string
  excludeSongIds?: Array<string>
}

async function fetchRandomSong({
  category = 'ALL',
  difficulty = 'EASY',
  excludeSongIds = [],
}: FetchSongParams): Promise<Song> {
  const params = new URLSearchParams()
  if (excludeSongIds.length > 0) {
    excludeSongIds.forEach((id) => params.append('excludeSongIds[]', id))
  }

  const url = `http://localhost:5000/api/game/play/${category}/${difficulty}${
    params.toString() ? `?${params.toString()}` : ''
  }`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch song')
  }

  return response.json()
}

export function useRandomSong(
  category: string = 'ALL',
  difficulty: string = 'HARD',
) {
  const queryClient = useQueryClient()
  const [playedSongIds, setPlayedSongIds] = useLocalStorage<Array<string>>(
    'playedSongIds',
    [],
  )

  const randomSongQuery = useQuery<Song, Error>({
    queryKey: ['song', category, difficulty, playedSongIds],
    queryFn: () =>
      fetchRandomSong({ category, difficulty, excludeSongIds: playedSongIds }),
    staleTime: Infinity,
    retry: false,
  })

  const nextSongMutation = useMutation<Song, Error, FetchSongParams>({
    mutationFn: fetchRandomSong,
    onSuccess: (newSong) => {
      const updatedIds = randomSongQuery.data
        ? [...playedSongIds, randomSongQuery.data.id]
        : playedSongIds

      queryClient.setQueryData(
        ['song', category, difficulty, updatedIds],
        newSong,
      )
    },
  })

  const handleNextSong = () => {
    let updatedPlayedSongIds = playedSongIds

    if (randomSongQuery.data) {
      updatedPlayedSongIds = [...playedSongIds, randomSongQuery.data.id]
      setPlayedSongIds(updatedPlayedSongIds)
    }

    nextSongMutation.mutate({
      category,
      difficulty,
      excludeSongIds: updatedPlayedSongIds,
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
