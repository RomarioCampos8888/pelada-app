import React from 'react';

export const Input = React.forwardRef(function Input(props, ref) {
  return <input ref={ref} {...props} className={`${props.className || ''} px-3 py-2 rounded-md border`} />;
});

export default Input;
