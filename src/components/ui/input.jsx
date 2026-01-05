import React from 'react';

export function Input(props) {
  return <input {...props} className={`${props.className || ''} px-3 py-2 rounded-md border`} />;
}

export default Input;
