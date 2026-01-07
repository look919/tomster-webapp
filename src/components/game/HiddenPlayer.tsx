import YouTube from 'react-youtube'
import type { useSongPlayer } from '@/hooks/useSongPlayer'

type HiddenPlayerProps = {
  song: {
    youtubeId: string
  }
  player: ReturnType<typeof useSongPlayer>
}

export const HiddenPlayer = (props: HiddenPlayerProps) => {
  return (
    <div className="hidden">
      <YouTube
        videoId={props.song.youtubeId}
        onReady={props.player.onReady}
        onStateChange={props.player.onStateChange}
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
  )
}
