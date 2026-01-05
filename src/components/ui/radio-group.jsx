import React, { createContext, useContext, useId } from 'react';

const RadioGroupContext = createContext(null);

export function RadioGroup({ children, value, onValueChange, className = '', name }) {
  const generatedName = name || useId();

  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, name: generatedName }}>
      <div className={className} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({ value: itemValue, id }) {
  const ctx = useContext(RadioGroupContext) || {};
  const { value, onValueChange, name } = ctx;

  const handleChange = () => {
    if (onValueChange) onValueChange(itemValue);
  };

  return (
    <>
      <input
        id={id}
        type="radio"
        value={itemValue}
        name={name || id}
        checked={value === itemValue}
        onChange={handleChange}
        className="sr-only"
      />
      <span
        aria-hidden
        className={`w-4 h-4 rounded-full flex items-center justify-center flex-none transition-colors border-2
          ${value === itemValue ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-300'}`}
      >
        {value === itemValue && <span className="w-2 h-2 bg-white rounded-full" />}
      </span>
    </>
  );
}

export default RadioGroup;
