import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '../ui/button'

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
  onSelect: (value: string) => void
  label: string
  displayLabels?: Record<string, string>
  colorScheme: 'difficulty' | 'genre' | 'country' | 'year'
}

const colorSchemes = {
  difficulty: {
    selected:
      'border-cyan-500 bg-gradient-to-br from-cyan-600/30 to-cyan-800/30 text-white',
    unselected: 'border-slate-600 hover:border-cyan-400 text-slate-300',
  },
  genre: {
    selected:
      'border-fuchsia-500 bg-gradient-to-br from-fuchsia-600/30 to-fuchsia-800/30 text-white',
    unselected: 'border-slate-600 hover:border-fuchsia-400 text-slate-300',
  },
  country: {
    selected:
      'border-green-500 bg-gradient-to-br from-green-600/30 to-green-800/30 text-white',
    unselected: 'border-slate-600 hover:border-green-400 text-slate-300',
  },
  year: {
    selected:
      'border-orange-500 bg-gradient-to-br from-orange-600/30 to-orange-800/30 text-white',
    unselected: 'border-slate-600 hover:border-orange-400 text-slate-300',
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
            key={option}
            onClick={() => onSelect(option)}
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
  variant?: string
  isVisible: boolean
  onClose: () => void
}

export const SelectNextSongForm = (props: SelectNextSongDialogProps) => {
  const { variant, isVisible, onClose } = props
  const navigate = useNavigate()

  // Parse variant string: DIFFICULTY-GENRE-COUNTRY-YEAR
  const parts = variant?.split('-') || []
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    parts[0] === 'RANDOM' ? null : parts[0] || null,
  )
  const [selectedGenre, setSelectedGenre] = useState<string | null>(
    parts[1] === 'RANDOM' ? null : parts[1] || null,
  )
  const [selectedCountry, setSelectedCountry] = useState<string | null>(
    parts[2] === 'RANDOM' ? null : parts[2] || null,
  )
  const [selectedYear, setSelectedYear] = useState<string | null>(
    parts[3] === 'RANDOM' ? null : parts[3] || null,
  )

  const handleDifficultySelect = (value: string) => {
    setSelectedDifficulty(selectedDifficulty === value ? null : value)
  }

  const handleGenreSelect = (value: string) => {
    setSelectedGenre(selectedGenre === value ? null : value)
  }

  const handleCountrySelect = (value: string) => {
    setSelectedCountry(selectedCountry === value ? null : value)
  }

  const handleYearSelect = (value: string) => {
    setSelectedYear(selectedYear === value ? null : value)
  }

  const handleLoadNextSong = () => {
    const newVariant = `${selectedDifficulty || 'RANDOM'}-${selectedGenre || 'RANDOM'}-${selectedCountry || 'RANDOM'}-${selectedYear || 'RANDOM'}`
    navigate({
      to: '/',
      search: {
        variant: newVariant,
      },
      reloadDocument: variant === newVariant,
    })
    onClose()
  }

  return (
    <div
      className={`flex flex-col items-center gap-6 w-full max-w-3xl mx-auto px-4 ${
        isVisible ? 'block' : 'hidden'
      }`}
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
        <OptionGrid
          options={difficulties}
          selected={selectedDifficulty}
          onSelect={handleDifficultySelect}
          label="Difficulty"
          colorScheme="difficulty"
        />
        <OptionGrid
          options={genres}
          selected={selectedGenre}
          onSelect={handleGenreSelect}
          label="Genre"
          colorScheme="genre"
        />
        <OptionGrid
          options={countries}
          selected={selectedCountry}
          onSelect={handleCountrySelect}
          label="Country"
          colorScheme="country"
        />
        <OptionGrid
          options={releaseYears}
          selected={selectedYear}
          onSelect={handleYearSelect}
          label="Release Year"
          displayLabels={releaseYearLabels}
          colorScheme="year"
        />
      </div>
      <Button onClick={handleLoadNextSong} className="w-full max-w-md mt-4">
        Load Next Song
      </Button>
    </div>
  )
}
