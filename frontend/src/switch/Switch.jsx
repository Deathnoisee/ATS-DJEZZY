import React from 'react';
import './switch.css';

function Switch({ checked = false, onChange, className = "" }) {
  return (
    <label className={`switch ${className}`.trim()}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span class="slider"></span>
    </label>
  );
}

export default Switch;