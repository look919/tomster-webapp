import { Eye } from 'lucide-react'
import { Button } from '../ui/button'

interface RevealSongProps {
  songTitle: string
  songArtists: Array<string>
  releaseYear: number
  youtubeId: string
  isSongRevealed: boolean
  setIsSongRevealed: (value: boolean) => void
  handleReportAndSkip: () => void
}

export const RevealSong = (props: RevealSongProps) => {
  const {
    isSongRevealed,
    setIsSongRevealed,
    handleReportAndSkip,
    youtubeId,
    songArtists,
    songTitle,
    releaseYear,
  } = props

  if (!isSongRevealed) {
    return (
      <>
        <Button
          onClick={() => setIsSongRevealed(true)}
          variant="default"
          className="gap-2 text-purple-300 -mt-4 mb-4"
        >
          <Eye className="w-4 h-4" />
          Reveal Song
        </Button>

        <Button
          onClick={handleReportAndSkip}
          variant="link"
          className="text-red-300 text-sm whitespace-normal text-center"
        >
          Another song, please! (Report and Skip)
        </Button>
      </>
    )
  }

  return (
    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center sm:min-w-sm">
      <a
        href={`https://www.youtube.com/watch?v=${youtubeId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-400 underline text-xl font-bold mb-2"
      >
        {songTitle}
      </a>
      <p className="text-purple-200 mb-1">{songArtists.join(' • ')}</p>
      <p className="text-purple-300 text-sm">{releaseYear}</p>
      <p className="text-purple-200"></p>
    </div>
  )
}
