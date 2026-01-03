type GameLayoutProps = {
  children: React.ReactNode
}

export function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">Tomster</h1>
          <p className="text-xl text-purple-200">Music Guessing Game</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl py-6 px-4 md:p-8 shadow-2xl overflow-visible">
          {children}
        </div>
      </div>
    </div>
  )
}
