import { Volume2 } from 'lucide-react'
import { useLocalStorage } from 'usehooks-ts'
import { useEffect } from 'react'

interface VolumeChangerProps {
  volume: number
  onVolumeChange: (volume: number) => void
}

interface Config {
  volume: number
}

export const VolumeChanger = (props: VolumeChangerProps) => {
  const { volume, onVolumeChange } = props
  const [config, setConfig] = useLocalStorage<Config>('config', { volume: 50 })

  useEffect(() => {
    // Load saved volume on mount
    if (config.volume !== volume) {
      onVolumeChange(config.volume)
    }
  }, [])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    onVolumeChange(newVolume)
  }

  const handleVolumeChangeEnd = () => {
    setConfig({ ...config, volume })
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xs">
      <div className="flex items-center gap-3 w-full">
        <Volume2 className="w-5 h-5 text-purple-300 shrink-0" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          onMouseUp={handleVolumeChangeEnd}
          onTouchEnd={handleVolumeChangeEnd}
          className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:bg-purple-400 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:hover:bg-purple-400"
          aria-label="Volume"
        />
        <span className="text-sm text-purple-300 font-medium min-w-[3ch] text-right">
          {volume}
        </span>
      </div>
    </div>
  )
}
