import { AlertCircle, RefreshCw } from 'lucide-react'

import { SelectNextSongForm } from './SelectNextSongForm'
import { GameLoading } from './GameLoading'
import { SongPlayer } from './SongPlayer'
import { useGameLogic } from '@/hooks/useGameLogic'

export const Game = () => {
  const { gameState, randomSongQuery, handleRetry, ...handlers } =
    useGameLogic()

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

  // This is the initial state before the user requests any song, later we wanna stick to the last render to keep the player rendered but hidden
  if (!randomSongQuery.isEnabled) {
    return <SelectNextSongForm handleGetNextSong={handlers.handleGetNewSong} />
  }

  if (randomSongQuery.isPending) {
    return <GameLoading />
  }

  return (
    <>
      {gameState === 'SONG-PLAYING' || gameState === 'SONG-REVEALED' ? (
        <SongPlayer
          song={randomSongQuery.data}
          gameState={gameState}
          {...handlers}
        />
      ) : null}
      {gameState === 'SONG-SELECTION' && (
        <SelectNextSongForm handleGetNextSong={handlers.handleGetNewSong} />
      )}
    </>
  )
}
