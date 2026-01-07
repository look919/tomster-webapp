import { useForm } from '@tanstack/react-form'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'
import { useGameVariant } from '@/hooks/useGameVariant'

const difficulties = ['VERYEASY', 'EASY', 'MEDIUM', 'HARD', 'VERYHARD'] as const
const genres = ['ROCK', 'RAP', 'POP', 'OTHER'] as const
const countries = ['LOCAL', 'INTERNATIONAL'] as const

const countryLabels: Record<string, string> = {
  LOCAL: 'LOCAL',
  INTERNATIONAL: 'GLOBAL',
}

const difficultyLabels: Record<string, string> = {
  RANDOM: 'RANDOM',
  VERYEASY: 'VERY EASY',
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
  VERYHARD: 'VERY HARD',
}

// Convert difficulty string to slider value (0-5, where 0 = RANDOM)
const difficultyToValue = (difficulty: string | null): number => {
  if (!difficulty || difficulty === 'RANDOM') return 0
  const index = difficulties.indexOf(
    difficulty as (typeof difficulties)[number],
  )
  return index === -1 ? 0 : index + 1
}

// Convert slider value (0-5) to difficulty string (0 = RANDOM/null)
const valueToDifficulty = (value: number): string | null => {
  if (value === 0) return null
  return difficulties[value - 1] || null
}

interface OptionGridProps {
  options: ReadonlyArray<string>
  selected: string | null
  onSelect: (value: string | null) => void
  label: string
  displayLabels?: Record<string, string>
  colorScheme: 'difficulty' | 'genre' | 'country'
}

const colorSchemes = {
  difficulty: {
    selected:
      'border-sky-600 bg-gradient-to-br from-sky-700/30 to-sky-900/30 text-white',
    unselected: 'border-slate-800 hover:border-sky-500 text-slate-300',
  },
  genre: {
    selected:
      'border-red-600 bg-gradient-to-br from-red-600/30 to-red-800/30 text-white',
    unselected: 'border-slate-800 hover:border-red-500 text-slate-300',
  },
  country: {
    selected:
      'border-green-500 bg-gradient-to-br from-green-600/30 to-green-800/30 text-white',
    unselected: 'border-slate-800 hover:border-green-400 text-slate-300',
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
  // For 4 items (genre), use 2x2 grid on mobile; otherwise flex row
  const isQuadGrid = options.length === 4

  return (
    <div className="space-y-3 w-full">
      <h3 className="text-sm font-semibold text-slate-200 text-center">
        {label}
      </h3>
      <div
        className={
          isQuadGrid
            ? 'grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 justify-center'
            : 'flex flex-wrap gap-2 sm:gap-3 justify-center'
        }
      >
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onSelect(selected === option ? null : option)}
            className={`flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-lg border-2 transition-all hover:scale-105 active:scale-95 ${
              isQuadGrid ? 'min-w-0' : 'min-w-[85px] sm:min-w-[120px]'
            } ${selected === option ? colors.selected : colors.unselected}`}
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

  // Parse variant string: DIFFICULTY-LOCALIZATION-GENRE
  const parts = variant.split('-')

  const form = useForm({
    defaultValues: {
      difficulty: parts[0] === 'RANDOM' ? null : parts[0] || null,
      country: parts[1] === 'RANDOM' ? null : parts[1] || null,
      genre: parts[2] === 'RANDOM' ? null : parts[2] || null,
    },
    onSubmit: ({ value }) => {
      const newVariant = `${value.difficulty || 'RANDOM'}-${value.country || 'RANDOM'}-${value.genre || 'RANDOM'}`
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
          Choose difficulty, genre, and song recognition for the next song.
        </p>
      </div>
      <div className="space-y-5 sm:space-y-6 w-full">
        <form.Field name="difficulty">
          {(field) => {
            const currentValue = difficultyToValue(field.state.value)
            const currentDifficulty = field.state.value || 'RANDOM'
            const isRandom = currentValue === 0
            return (
              <div className="space-y-3 w-full">
                <h3 className="text-sm font-semibold text-slate-200 text-center">
                  Difficulty
                </h3>
                <div className="flex flex-col items-center gap-3">
                  <span
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold text-white ${
                      isRandom
                        ? 'bg-linear-to-br from-amber-500 to-orange-600'
                        : 'bg-linear-to-br from-sky-700 to-sky-900'
                    }`}
                  >
                    {difficultyLabels[currentDifficulty]}
                  </span>
                  <div className="w-full max-w-xs px-2">
                    <Slider
                      value={[currentValue]}
                      onValueChange={([value]) =>
                        field.handleChange(valueToDifficulty(value))
                      }
                      min={0}
                      max={5}
                      step={1}
                    />
                  </div>
                </div>
              </div>
            )
          }}
        </form.Field>
        <form.Field name="country">
          {(field) => (
            <OptionGrid
              options={countries}
              selected={field.state.value}
              onSelect={(value) => field.handleChange(value)}
              label="Song Recognition"
              displayLabels={countryLabels}
              colorScheme="country"
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
      </div>
      <Button type="submit" className="w-full max-w-md mt-4">
        Load Next Song
      </Button>
    </form>
  )
}
