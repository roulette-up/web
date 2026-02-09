import { useMemo } from 'react'
const logo = '/favicon.svg'

type RouletteWheelProps = {
  isSpinning: boolean
  onSpinEnd?: () => void
}

function RouletteWheel({ isSpinning, onSpinEnd }: RouletteWheelProps) {
  const segments = useMemo(() => Array.from({ length: 12 }, (_, index) => index), [])

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute top-[-6px] h-0 w-0 border-x-[12px] border-b-[22px] border-x-transparent border-b-black" />
      <div className="relative h-72 w-72">
        <div
          className={`absolute inset-0 rounded-full border-4 border-black ${
            isSpinning ? 'animate-roulette-spin' : ''
          }`}
          onAnimationEnd={onSpinEnd}
        >
          <div className="absolute inset-0 rounded-full border-2 border-black" />
          <div className="absolute inset-2 rounded-full border border-black" />
          {segments.map((segment) => (
            <div
              key={segment}
              className="absolute left-1/2 top-1/2 h-1 w-[130px] -translate-y-1/2 origin-left bg-black"
              style={{ transform: `rotate(${segment * 30}deg)` }}
            />
          ))}
          <div className="absolute inset-8 rounded-full border-2 border-black bg-white" />
        </div>
        <div className="absolute inset-[102px] overflow-hidden rounded-full border-4 border-black bg-white">
          <img src={logo} alt="Roulette-Up" className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="absolute bottom-[-14px] h-3 w-24 rounded-full border border-black bg-white" />
    </div>
  )
}

export default RouletteWheel
