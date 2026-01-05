import React from 'react';

export function Textarea(props) {
  return <textarea {...props} className={`${props.className || ''} px-3 py-2 rounded-md border`} />;
}

export default Textarea;
