import React from 'react';

export function Button({ children, className = '', variant, size, onClick, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-md shadow-sm';
  return (
    <button onClick={onClick} className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
