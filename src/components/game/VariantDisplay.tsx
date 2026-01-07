import { Fragment } from 'react/jsx-runtime'
import { useSearch } from '@tanstack/react-router'
import type { SearchSchema } from '@/types/game'
import { useGameVariant } from '@/hooks/useGameVariant'

const countryLabels: Record<string, string> = {
  LOCAL: 'LOCAL',
  INTERNATIONAL: 'GLOBAL',
}

const difficultyLabels: Record<string, string> = {
  VERYEASY: 'VERY EASY',
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
  VERYHARD: 'VERY HARD',
}

export const VariantDisplay = () => {
  const variant = useGameVariant()
  const searchParams = useSearch({ from: '/' })
  const playSong = (searchParams as SearchSchema).playSong

  if (playSong) {
    return (
      <div className="text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-600">
          <span className="px-3 py-1 rounded-md text-sm font-semibold text-white bg-linear-to-br from-amber-500 to-orange-600">
            QR
          </span>
        </div>
      </div>
    )
  }

  if (variant === 'RANDOM-RANDOM-RANDOM') {
    return (
      <div className="text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-600">
          <span className="px-3 py-1 rounded-md text-sm font-semibold text-white bg-linear-to-br from-amber-500 to-orange-600">
            RANDOM
          </span>
        </div>
      </div>
    )
  }

  const [difficulty, country, genre] = variant.split('-')

  const items = [
    difficulty !== 'RANDOM' && (
      <span
        key="difficulty"
        className="px-3 py-1 rounded-md text-sm font-semibold text-white bg-linear-to-br from-sky-700 to-sky-900"
      >
        {difficultyLabels[difficulty] || difficulty}
      </span>
    ),
    country !== 'RANDOM' && (
      <span
        key="country"
        className="px-3 py-1 rounded-md text-sm font-semibold text-white bg-linear-to-br from-green-600 to-green-800"
      >
        {countryLabels[country] || country}
      </span>
    ),
    genre !== 'RANDOM' && (
      <span
        key="genre"
        className="px-3 py-1 rounded-md text-sm font-semibold text-white bg-linear-to-br from-red-600 to-red-800"
      >
        {genre}
      </span>
    ),
  ].filter(Boolean)

  return (
    <div className="text-center">
      <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-600">
        {items.map((item, index) => (
          <Fragment key={`item-${index}`}>
            {item}
            {index < items.length - 1 && (
              <span key={`dot-${index}`} className="text-slate-400">
                •
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
