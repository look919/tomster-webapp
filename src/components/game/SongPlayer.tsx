import YouTube from 'react-youtube'

import { VariantDisplay } from './VariantDisplay'
import { RevealSong } from './RevealSong'
import { SongButton } from './SongButton'
import { VolumeChanger } from './VolumeChanger'
import type { GameState, Song } from '@/types/game'
import { useSongPlayer } from '@/hooks/useSongPlayer'

interface MusicPlayerProps {
  song: Song
  gameState: GameState
  handleRevealSong: () => void
  handleReportAndSkip: () => void
  handleSelectNextSong: () => void
}

export const SongPlayer = (props: MusicPlayerProps) => {
  const { song, gameState, handleRevealSong, handleSelectNextSong } = props
  const player = useSongPlayer(song)

  return (
    <>
      <div className="hidden">
        <YouTube
          videoId={props.song.youtubeId}
          onReady={player.onReady}
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

      <div className="flex flex-col gap-4">
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
