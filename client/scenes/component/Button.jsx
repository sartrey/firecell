import React from 'react';
import './Button.scss';

export default function Button(props) {
  const { icon, text, frame, theme = 'basic', onClick } = props;
  const classes = ['button'];
  if (theme) classes.push(`theme-${theme}`);
  return (
    <a className={classes.join(' ')} onClick={onClick}>
      { icon && <i className='md-icons'>{icon}</i> }
      { text && <span>{text}</span> }
    </a>
  );
}