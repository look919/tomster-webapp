import { Loader2, Play, Square } from 'lucide-react'

interface SongButtonProps {
  ready: boolean
  playing: boolean
  onPlay: () => void
  onStop: () => void
}

export const SongButton = (props: SongButtonProps) => {
  const { ready, playing, onPlay, onStop } = props

  return (
    <button
      onClick={!playing ? onPlay : onStop}
      disabled={!ready}
      className="flex flex-col items-center gap-2 group"
    >
      <div
        className={`w-32 h-32 rounded-full flex items-center justify-center 
                    transition-all transform group-hover:scale-105 group-active:scale-95 
                    ${
                      !ready
                        ? 'bg-purple-600 cursor-not-allowed opacity-50'
                        : 'bg-purple-500 group-hover:bg-purple-600 shadow-lg shadow-purple-500/50'
                    }`}
      >
        {!ready ? (
          <Loader2 className="w-16 h-16 text-white animate-spin" />
        ) : playing ? (
          <Square className="w-16 h-16 text-white" fill="white" />
        ) : (
          <Play className="w-16 h-16 text-white ml-2" fill="white" />
        )}
      </div>
    </button>
  )
}
