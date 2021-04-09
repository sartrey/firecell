import React from 'react';
import './Input.scss';

export default function Input(props) {
  const { type, label, error, value, onChange, } = props;
  return (
    <div className='input'>
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} />
      {error ? (<p className='error'>{error}</p>) : null}
    </div>
  );
}