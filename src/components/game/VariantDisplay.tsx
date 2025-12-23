import { Fragment } from 'react/jsx-runtime'

const releaseYearLabels: Record<string, string> = {
  PRE2000: '<2000',
  '2000TO2015': '2000-2015',
  POST2015: '>2015',
  RANDOM: 'RANDOM',
}

interface VariantDisplayProps {
  variant: string
}

export const VariantDisplay = (props: VariantDisplayProps) => {
  const { variant } = props

  if (variant === 'RANDOM-RANDOM-RANDOM-RANDOM') {
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

  const [difficulty, genre, country, releaseYear] = variant.split('-')

  const items = [
    difficulty !== 'RANDOM' && (
      <span
        key="difficulty"
        className="px-3 py-1 rounded-md text-sm font-semibold text-white bg-linear-to-br from-cyan-600 to-cyan-800"
      >
        {difficulty}
      </span>
    ),
    genre !== 'RANDOM' && (
      <span
        key="genre"
        className="px-3 py-1 rounded-md text-sm font-semibold text-white bg-linear-to-br from-fuchsia-600 to-fuchsia-800"
      >
        {genre}
      </span>
    ),
    country !== 'RANDOM' && (
      <span
        key="country"
        className="px-3 py-1 rounded-md text-sm font-semibold text-white bg-linear-to-br from-green-600 to-green-800"
      >
        {country}
      </span>
    ),
    releaseYear !== 'RANDOM' && (
      <span
        key="year"
        className="px-3 py-1 rounded-md text-sm font-semibold text-white bg-linear-to-br from-orange-600 to-orange-800"
      >
        {releaseYearLabels[releaseYear] || releaseYear}
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

// Deprecated: Use VariantDisplay instead
export const CategoryAndDifficulty = VariantDisplay
