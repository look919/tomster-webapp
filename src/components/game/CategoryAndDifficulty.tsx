interface CategoryAndDifficultyProps {
  category: string
  difficulty: string
}

export const CategoryAndDifficulty = (props: CategoryAndDifficultyProps) => {
  const { category, difficulty } = props

  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 px-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
        <span className="text-purple-200 text-sm font-medium">{category}</span>
        <span className="text-purple-300">•</span>
        <span className="text-purple-200 text-sm font-medium">
          {difficulty}
        </span>
      </div>
    </div>
  )
}
