const BASE_URL = import.meta.env.VITE_APP_BASE_URL

export interface Song {
  id: string
  title: string
  artists: Array<string>
  youtubeId: string
  clipDuration: number
  clipStartTime: number
  releaseYear: number
}

export type ReportCategory = 'WRONG_SONG_DATA' | 'SONG_ISSUE' | 'OTHER'

interface FetchSongParams {
  variant: string
}

export async function fetchRandomSong({
  variant,
}: FetchSongParams): Promise<Song> {
  const url = `${BASE_URL}/api/game/play/${variant}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch song')
  }

  return response.json()
}

interface ReportSongParams {
  songId: string
  category: ReportCategory
  message?: string
}

export async function reportSong({
  songId,
  category,
  message,
}: ReportSongParams): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/game/songs/${songId}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ category, message }),
  })

  if (!response.ok) {
    throw new Error('Failed to report song')
  }
}
