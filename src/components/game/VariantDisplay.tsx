import { Fragment } from 'react/jsx-runtime'
import { useGameVariant } from '@/hooks/useGameVariant'

const countryLabels: Record<string, string> = {
  LOCAL: 'LOCAL',
  INTERNATIONAL: 'GLOBAL',
}

export const VariantDisplay = () => {
  const variant = useGameVariant()

  if (variant === 'RANDOM-RANDOM-RANDOM') {
    return (
      <div className="text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-600">
          <span className="px-3 py-1 rounded-md text-sm font-semibold text-white bg-linear-to-br from-purple-600 to-purple-800">
            RANDOM
          </span>
        </div>
      </div>
    )
  }

  const [difficulty, genre, country] = variant.split('-')

  const items = [
    difficulty !== 'RANDOM' && (
      <span
        key="difficulty"
        className="px-3 py-1 rounded-md text-sm font-semibold text-white bg-linear-to-br from-sky-700 to-sky-900"
      >
        {difficulty}
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
    country !== 'RANDOM' && (
      <span
        key="country"
        className="px-3 py-1 rounded-md text-sm font-semibold text-white bg-linear-to-br from-green-600 to-green-800"
      >
        {countryLabels[country] || country}
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
