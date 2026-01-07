import z from 'zod'

export const searchSchema = z.object({
  variant: z.string().optional(),
  playSong: z.boolean().optional(),
})

export type SearchSchema = z.infer<typeof searchSchema>

export type GameState =
  | 'SONG-SELECTION'
  | 'SONG-PLAYING'
  | 'SONG-REVEALED'
  | 'SONG-REPORTING'

export type Song = {
  id: string
  title: string
  artists: Array<string>
  youtubeId: string
  clipDuration: number
  clipStartTime: number
  releaseYear: number
}
