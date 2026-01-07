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
  VERYEASY: 'VERY EASY',
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
  VERYHARD: 'VERY HARD',
}

// Convert difficulty string to slider value (1-5)
const difficultyToValue = (difficulty: string | null): number => {
  if (!difficulty) return 3 // Default to MEDIUM
  const index = difficulties.indexOf(
    difficulty as (typeof difficulties)[number],
  )
  return index === -1 ? 3 : index + 1
}

// Convert slider value (1-5) to difficulty string
const valueToDifficulty = (value: number): string => {
  return difficulties[value - 1] || 'MEDIUM'
}

interface OptionGridProps {
  options: ReadonlyArray<string>
  selected: string | null
  onSelect: (value: string | null) => void
  label: string
  displayLabels?: Record<string, string>
  colorScheme: 'genre' | 'country'
}

const colorSchemes = {
  genre: {
    selected:
      'border-red-600 bg-gradient-to-br from-red-600/30 to-red-800/30 text-white',
    unselected: 'border-slate-700 hover:border-red-500 text-slate-300',
  },
  country: {
    selected:
      'border-green-500 bg-gradient-to-br from-green-600/30 to-green-800/30 text-white',
    unselected: 'border-slate-700 hover:border-green-400 text-slate-300',
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
  const isRandom = selected === null

  return (
    <div className="space-y-3 w-full">
      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            isRandom
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
              : 'border border-slate-700 text-slate-400 hover:border-amber-500 hover:text-amber-400'
          }`}
        >
          RANDOM
        </button>
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onSelect(option)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selected === option
                ? `${colors.selected} shadow-lg`
                : colors.unselected
            } border`}
          >
            {displayLabels?.[option] || option}
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
      className="flex flex-col gap-6 w-full max-w-lg mx-auto px-4"
    >
      <div className="space-y-6">
        {/* Difficulty Section */}
        <form.Field name="difficulty">
          {(field) => {
            const isRandom = field.state.value === null
            const currentValue = difficultyToValue(field.state.value)
            return (
              <div className="space-y-3">
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Difficulty
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => field.handleChange(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
                      isRandom
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                        : 'border border-slate-700 text-slate-400 hover:border-amber-500 hover:text-amber-400'
                    }`}
                  >
                    RANDOM
                  </button>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`flex-1 ${isRandom ? 'opacity-40' : ''}`}>
                      <Slider
                        value={[currentValue]}
                        onValueChange={([value]) =>
                          field.handleChange(valueToDifficulty(value))
                        }
                        min={1}
                        max={5}
                        step={1}
                      />
                    </div>
                    {!isRandom && (
                      <span className="text-sm font-medium text-sky-400 min-w-[80px] text-right">
                        {difficultyLabels[field.state.value || 'MEDIUM']}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          }}
        </form.Field>

        {/* Country Section */}
        <form.Field name="country">
          {(field) => (
            <OptionGrid
              options={countries}
              selected={field.state.value}
              onSelect={(value) => field.handleChange(value)}
              label="Recognition"
              displayLabels={countryLabels}
              colorScheme="country"
            />
          )}
        </form.Field>

        {/* Genre Section */}
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

      <Button type="submit" className="w-full mt-2">
        Load Next Song
      </Button>
    </form>
  )
}
