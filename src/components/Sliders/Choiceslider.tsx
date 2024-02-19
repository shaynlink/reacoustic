import React, { useState } from 'react';
import { Choicevalue } from '../../atom';
import { useAtom } from 'jotai';

const SliderComponentChoices: React.FC = () => {
  const [value, setValue] = useAtom(Choicevalue)// Initial value

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  return (
    <div>
      <input 
        type="range" 
        min={3} 
        max={6} 
        value={value} 
        onChange={handleChange}
        className ="Slider" 
      />
      <p>{value} Choices</p>
    </div>
  );
};

export default SliderComponentChoices;