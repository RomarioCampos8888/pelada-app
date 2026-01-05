import React from 'react';

export function Label(props) {
  return <label {...props} className={`${props.className || ''} block text-sm font-medium`} />;
}

export default Label;
