import { useState, useEffect } from 'react'

interface TimerProps {
  maxTime: number
  onTimeout: () => void
}

export default function Timer ({ maxTime, onTimeout }: TimerProps): JSX.Element {
  const [time, setTime] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (time >= maxTime) {
        clearInterval(interval)
        onTimeout()
      }
      setTime((prevTime) => prevTime + 1)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="time-bar">
      <div className="time-progress" style={{ width: `${time / 10}%` }}></div>
    </div>
  )
}
