import React from 'react';
import './Input.scss';

export default function Input(props) {
  const { type, label, value, onChange, } = props;
  return (
    <div className='input'>
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} />
    </div>
  );
}