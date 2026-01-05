import React from 'react';

export function Slider({ value = [0], onValueChange = () => {}, min = 0, max = 100, step = 1, className = '' }) {
  const val = Array.isArray(value) ? value[0] : value;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={val}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      className={className}
    />
  );
}

export default Slider;
