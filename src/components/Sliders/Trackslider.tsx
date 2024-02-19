import React, { useState } from 'react';
import { Tracksvalue } from '../../atom';
import { useAtom } from 'jotai';

const SliderComponentTrack: React.FC = () => {
  const [value, setValue] = useAtom(Tracksvalue)// Initial value

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  return (
    <div>
      <input 
        type="range" 
        min={10} 
        max={50} 
        value={value} 
        onChange={handleChange} 
        className ="Slider"
      />
      <p>{value} Tracks</p>
    </div>
  );
};

export default SliderComponentTrack;