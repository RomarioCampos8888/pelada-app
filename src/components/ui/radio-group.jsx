import React from 'react';

export function RadioGroup({ children, value, onValueChange, className = '' }) {
  return (
    <div className={className} role="radiogroup">
      {children}
    </div>
  );
}

export function RadioGroupItem({ value: itemValue, id }) {
  return (
    <input id={id} type="radio" value={itemValue} name={id} className="sr-only" />
  );
}

export default RadioGroup;
