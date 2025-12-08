import { Grid3x3, Guitar, MapPin, Mic2, Music, Sparkles } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'

const categories = [
  { id: 'ALL', label: 'All', icon: Grid3x3 },
  { id: 'POP', label: 'Pop', icon: Music },
  { id: 'RAP', label: 'Rap', icon: Mic2 },
  { id: 'ROCK', label: 'Rock', icon: Guitar },
  { id: 'LOCAL', label: 'Local', icon: MapPin },
  { id: 'OTHER', label: 'Other', icon: Sparkles },
]

function CategoryGrid({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: string
  onSelectCategory: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {categories.map((category) => {
        const Icon = category.icon
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all hover:scale-105 active:scale-95 ${
              selectedCategory === category.id
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-slate-300 hover:border-purple-300'
            }`}
          >
            <Icon className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">{category.label}</span>
          </button>
        )
      })}
    </div>
  )
}

interface SelectNextSongDialogProps {
  category?: string
  difficulty?: string
}

export const SelectNextSongDialog = (props: SelectNextSongDialogProps) => {
  const { category, difficulty } = props
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState(category || 'ALL')
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    difficulty || 'EASY',
  )

  const handleChangeCategory = () => {
    navigate({
      to: '/',
      search: { category: selectedCategory, difficulty: selectedDifficulty },
    })
    setIsDialogOpen(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Next song!</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-w-[90vw] ">
        <DialogHeader>
          <DialogTitle>Select Category & Difficulty</DialogTitle>
          <DialogDescription>
            Choose a new category and difficulty for the next song.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue={selectedDifficulty}
          onValueChange={setSelectedDifficulty}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="EASY">Easy</TabsTrigger>
            <TabsTrigger value="HARD">Hard</TabsTrigger>
          </TabsList>
          <TabsContent value="EASY" className="mt-4">
            <CategoryGrid
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </TabsContent>
          <TabsContent value="HARD" className="mt-4">
            <CategoryGrid
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </TabsContent>
        </Tabs>
        <Button onClick={handleChangeCategory} className="w-full mt-4">
          Load Next Song
        </Button>
      </DialogContent>
    </Dialog>
  )
}
