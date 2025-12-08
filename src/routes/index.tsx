import { createFileRoute } from '@tanstack/react-router'

import { GameLayout } from '@/components/game/GameLayout'
import { Game } from '@/components/game/Game'
import { searchSchema } from '@/hooks/useGameLogic'

export const Route = createFileRoute('/')({
  component: HomePage,
  validateSearch: searchSchema,
})

function HomePage() {
  return (
    <GameLayout>
      <Game />
    </GameLayout>
  )
}
