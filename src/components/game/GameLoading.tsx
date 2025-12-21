import { Loader2 } from 'lucide-react'
import { CategoryAndDifficulty } from './VariantDisplay'

type GameLoadingProps = {
  variant: string
}

export const GameLoading = ({ variant }: GameLoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <CategoryAndDifficulty variant={variant} />
      <button
        disabled
        className="w-32 h-32 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 bg-purple-600 cursor-not-allowed opacity-50"
      >
        <Loader2 className="w-16 h-16 text-white animate-spin" />
      </button>
    </div>
  )
}
