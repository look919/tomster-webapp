import YouTube from 'react-youtube'
import { AlertCircle, Loader2, Play, RefreshCw, Square } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../ui/button'
import { SelectNextSongForm } from './SelectNextSongForm'
import { VariantDisplay } from './VariantDisplay'
import { GameLoading } from './GameLoading'
import { RevealSong } from './RevealSong'
import { VolumeChanger } from './VolumeChanger'
import { useGameLogic } from '@/hooks/useGameLogic'
import { useSongPlayer } from '@/hooks/useSongPlayer'

export const Game = () => {
  const {
    variant,
    randomSongQuery,
    isSongRevealed,
    setIsSongRevealed,
    handleRetry,
    handleReportAndSkip,
  } = useGameLogic()
  const {
    playing,
    ready,
    hasPlayed,
    volume,
    handlePlay,
    handleStop,
    handleVolumeChange,
    onReady,
  } = useSongPlayer(randomSongQuery.data)
  const [isSelectingNextSong, setIsSelectingNextSong] = useState(false)

  if (randomSongQuery.error) {
    return (
      <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded mb-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">Error loading song</span>
        </div>
        <p className="text-sm">{randomSongQuery.error.message}</p>
        <button
          onClick={handleRetry}
          className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    )
  }

  if (randomSongQuery.isPending) {
    return <GameLoading variant={variant} />
  }

  console.log('Random Song:', randomSongQuery.data)

  return (
    <>
      {/* Hidden YouTube Player */}
      <div className="hidden">
        <YouTube
          videoId={randomSongQuery.data.youtubeId}
          onReady={onReady}
          opts={{
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              modestbranding: 1,
            },
          }}
        />
      </div>

      {/* Player View */}
      <div
        className={`flex flex-col items-center gap-6 ${
          isSelectingNextSong ? 'hidden' : 'block'
        }`}
      >
        <VariantDisplay variant={variant} />
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={!playing ? handlePlay : handleStop}
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
          <VolumeChanger volume={volume} onVolumeChange={handleVolumeChange} />
        </div>

        {hasPlayed && (
          <div className="flex flex-col items-center gap-3 mt-2">
            <RevealSong
              songTitle={randomSongQuery.data.title}
              songArtists={randomSongQuery.data.artists}
              releaseYear={randomSongQuery.data.releaseYear}
              youtubeId={randomSongQuery.data.youtubeId}
              isSongRevealed={isSongRevealed}
              setIsSongRevealed={setIsSongRevealed}
              handleReportAndSkip={handleReportAndSkip}
            />

            {isSongRevealed && (
              <Button
                variant="default"
                className="mt-4"
                onClick={() => {
                  handleStop()
                  setIsSelectingNextSong(true)
                }}
              >
                Next song!
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Song Selection View */}
      <SelectNextSongForm
        variant={variant}
        isVisible={isSelectingNextSong}
        onClose={() => setIsSelectingNextSong(false)}
      />
    </>
  )
}
