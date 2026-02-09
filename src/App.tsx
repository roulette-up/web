import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6">
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-lg backdrop-blur">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Vite + React + Tailwind
          </h1>
          <p className="mt-2 text-slate-600">
            TanStack Query is wired. You can start building screens now.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <button
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              onClick={() => setCount((value) => value + 1)}
            >
              Count: {count}
            </button>
            <span className="text-sm text-slate-500">Edit `src/App.tsx`</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
