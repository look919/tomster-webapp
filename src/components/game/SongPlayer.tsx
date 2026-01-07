import { VariantDisplay } from './VariantDisplay'
import { RevealSong } from './RevealSong'
import { SongButton } from './SongButton'
import { VolumeChanger } from './VolumeChanger'
import { ReportSongDialog } from './ReportSongDialog'
import type { GameState, Song } from '@/types/game'
import type { useSongPlayer } from '@/hooks/useSongPlayer'

interface MusicPlayerProps {
  song: Song
  player: ReturnType<typeof useSongPlayer>
  gameState: GameState
  handleRevealSong: () => void
  handleSelectNextSong: () => void
}

export const SongPlayer = (props: MusicPlayerProps) => {
  const { song, player, gameState, handleRevealSong, handleSelectNextSong } =
    props

  return (
    <>
      <div className="relative flex flex-col gap-4">
        <div className="absolute -top-4 -right-4">
          <ReportSongDialog
            songId={song.id}
            isRevealed={gameState === 'SONG-REVEALED'}
          />
        </div>
        <div
          className={`flex flex-col items-center gap-6 ${
            gameState === 'SONG-PLAYING' || gameState === 'SONG-REVEALED'
              ? 'block'
              : 'hidden'
          }`}
        >
          <VariantDisplay />
          <div className="flex flex-col items-center gap-4">
            <SongButton
              ready={player.ready}
              playing={player.playing}
              onPlay={player.handlePlay}
              onStop={player.handleStop}
            />
            <VolumeChanger
              volume={player.volume}
              onVolumeChange={player.handleVolumeChange}
            />
          </div>
        </div>
        {player.hasPlayed && (
          <RevealSong
            song={song}
            gameState={gameState}
            handleRevealSong={handleRevealSong}
            handleStop={player.handleStop}
            handleSelectNextSong={handleSelectNextSong}
          />
        )}
      </div>
    </>
  )
}
