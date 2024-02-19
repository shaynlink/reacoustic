import React from 'react'
import { Timevalue } from '../../atom'
import { useAtom } from 'jotai'

const SliderComponentTime: React.FC = () => {
  const [value, setValue] = useAtom(Timevalue)// Initial value

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(Number(event.target.value))
  }

  return (
    <div>
      <input
        type="range"
        min={10}
        max={30}
        value={value}
        onChange={handleChange}
        className="Slider"
      />
      <p>{value} seconds</p>
    </div>
  )
}

export default SliderComponentTime
