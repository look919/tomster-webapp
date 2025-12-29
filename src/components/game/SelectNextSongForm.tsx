import { useForm } from '@tanstack/react-form'
import { Button } from '../ui/button'
import { useGameVariant } from '@/hooks/useGameVariant'

const difficulties = ['EASY', 'MEDIUM', 'HARD'] as const
const genres = ['ROCK', 'RAP', 'POP', 'OTHER'] as const
const countries = ['LOCAL', 'INTERNATIONAL'] as const
const releaseYears = ['PRE2000', '2000TO2015', 'POST2015'] as const

const releaseYearLabels: Record<string, string> = {
  PRE2000: '<2000',
  '2000TO2015': '2000-2015',
  POST2015: '>2015',
}

interface OptionGridProps {
  options: ReadonlyArray<string>
  selected: string | null
  onSelect: (value: string | null) => void
  label: string
  displayLabels?: Record<string, string>
  colorScheme: 'difficulty' | 'genre' | 'country' | 'year'
}

const colorSchemes = {
  difficulty: {
    selected:
      'border-cyan-500 bg-gradient-to-br from-cyan-600/30 to-cyan-800/30 text-white',
    unselected: 'border-slate-800 hover:border-cyan-400 text-slate-300',
  },
  genre: {
    selected:
      'border-fuchsia-500 bg-gradient-to-br from-fuchsia-600/30 to-fuchsia-800/30 text-white',
    unselected: 'border-slate-800 hover:border-fuchsia-400 text-slate-300',
  },
  country: {
    selected:
      'border-green-500 bg-gradient-to-br from-green-600/30 to-green-800/30 text-white',
    unselected: 'border-slate-800 hover:border-green-400 text-slate-300',
  },
  year: {
    selected:
      'border-orange-500 bg-gradient-to-br from-orange-600/30 to-orange-800/30 text-white',
    unselected: 'border-slate-800 hover:border-orange-400 text-slate-300',
  },
}

function OptionGrid({
  options,
  selected,
  onSelect,
  label,
  displayLabels,
  colorScheme,
}: OptionGridProps) {
  const colors = colorSchemes[colorScheme]

  return (
    <div className="space-y-3 w-full">
      <h3 className="text-sm font-semibold text-slate-200 text-center">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onSelect(selected === option ? null : option)}
            className={`flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-lg border-2 transition-all hover:scale-105 active:scale-95 min-w-[120px] ${
              selected === option ? colors.selected : colors.unselected
            }`}
          >
            <span className="text-xs sm:text-sm font-medium">
              {displayLabels?.[option] || option}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

interface SelectNextSongDialogProps {
  handleGetNextSong: (newVariant: string) => void
}

export const SelectNextSongForm = (props: SelectNextSongDialogProps) => {
  const { handleGetNextSong } = props
  const variant = useGameVariant()

  // Parse variant string: DIFFICULTY-GENRE-COUNTRY-YEAR
  const parts = variant.split('-')

  const form = useForm({
    defaultValues: {
      difficulty: parts[0] === 'RANDOM' ? null : parts[0] || null,
      genre: parts[1] === 'RANDOM' ? null : parts[1] || null,
      country: parts[2] === 'RANDOM' ? null : parts[2] || null,
      year: parts[3] === 'RANDOM' ? null : parts[3] || null,
    },
    onSubmit: ({ value }) => {
      const newVariant = `${value.difficulty || 'RANDOM'}-${value.genre || 'RANDOM'}-${value.country || 'RANDOM'}-${value.year || 'RANDOM'}`
      handleGetNextSong(newVariant)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className={`flex flex-col items-center gap-6 w-full max-w-3xl mx-auto px-4`}
    >
      <div className="text-center w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Select Song Options
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          Choose difficulty, genre, country, and release year for the next song.
        </p>
      </div>
      <div className="space-y-5 sm:space-y-6 w-full">
        <form.Field name="difficulty">
          {(field) => (
            <OptionGrid
              options={difficulties}
              selected={field.state.value}
              onSelect={(value) => field.handleChange(value)}
              label="Difficulty"
              colorScheme="difficulty"
            />
          )}
        </form.Field>
        <form.Field name="genre">
          {(field) => (
            <OptionGrid
              options={genres}
              selected={field.state.value}
              onSelect={(value) => field.handleChange(value)}
              label="Genre"
              colorScheme="genre"
            />
          )}
        </form.Field>
        <form.Field name="country">
          {(field) => (
            <OptionGrid
              options={countries}
              selected={field.state.value}
              onSelect={(value) => field.handleChange(value)}
              label="Country"
              colorScheme="country"
            />
          )}
        </form.Field>
        <form.Field name="year">
          {(field) => (
            <OptionGrid
              options={releaseYears}
              selected={field.state.value}
              onSelect={(value) => field.handleChange(value)}
              label="Release Year"
              displayLabels={releaseYearLabels}
              colorScheme="year"
            />
          )}
        </form.Field>
      </div>
      <Button type="submit" className="w-full max-w-md mt-4">
        Load Next Song
      </Button>
    </form>
  )
}
