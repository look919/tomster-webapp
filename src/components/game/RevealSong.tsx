import { Eye } from 'lucide-react'
import { Button } from '../ui/button'
import type { GameState, Song } from '@/types/game'

interface RevealSongProps {
  gameState: GameState
  song: Song
  handleStop: () => void
  handleSelectNextSong: () => void
  handleRevealSong: () => void
}

export const RevealSong = (props: RevealSongProps) => {
  const { gameState, song, ...handlers } = props

  if (gameState === 'SONG-REVEALED') {
    return (
      <div className="flex flex-col items-center mt-4">
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center sm:min-w-sm">
          <a
            href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 underline text-xl font-bold mb-2"
          >
            {song.title}
          </a>
          <p className="text-purple-200 mb-1">{song.artists.join(' • ')}</p>
          <p className="text-purple-300 text-sm">{song.releaseYear}</p>
          <p className="text-purple-200"></p>
        </div>
        <Button
          variant="default"
          className="mt-4"
          onClick={() => {
            handlers.handleStop()
            handlers.handleSelectNextSong()
          }}
        >
          Next song!
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <Button
        onClick={handlers.handleRevealSong}
        variant="default"
        className="gap-2 mb-4"
      >
        <Eye className="w-4 h-4" />
        Reveal Song
      </Button>
    </div>
  )
}
