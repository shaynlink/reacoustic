import { useState, useEffect } from 'react'

interface TimerProps {
  maxTime: number
  onTimeout: () => void
  start: boolean
}

export default function Timer({ maxTime, onTimeout, start }: Readonly<TimerProps>): JSX.Element {
  const [time, setTime] = useState<number>(0)

  useEffect(() => {
    if (start) {
      let _time = time
      const interval = setInterval(() => {
        if (_time >= maxTime) {
          clearInterval(interval)
          onTimeout()
        }
        setTime((prevTime) => prevTime + 1)
        _time++
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [start])

  return (
    <div className="time-bar">
      <div className="time-progress" style={{ width: `${(time / maxTime) * 100}%` }}></div>
    </div>
  )
}
