import { useSearch } from '@tanstack/react-router'
import type { SearchSchema } from '@/types/game'

export const useGameVariant = () => {
  const searchParams = useSearch({ from: '/' })
  const variant =
    (searchParams as SearchSchema).variant || 'RANDOM-RANDOM-RANDOM-RANDOM'

  return variant
}
