import React, { useState, useEffect, } from 'react';
import './Modal.scss';

export default function Modal(props) {
  const { children, disabled, name, title, onClose } = props;
  const [anime, setAnime] = useState(false);

  const classes = ['modal', `modal-${name}`];
  if (disabled) classes.push('disabled');
  if (anime) classes.push('anime');

  const closeModal = () => {
    setAnime(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 100);
  }

  useEffect(() => {
    setAnime(true);
  }, []);

  return (
    <div className={classes.join(' ')} onClick={closeModal}>
      <div className='dialog' onClick={e => e.stopPropagation()}>
        <div className='header'>
          <div className='title'>{title}</div>
          <div className='close'>
            <a onClick={closeModal}><i className='md-icons'>close</i></a>
          </div>
        </div>
        <div className='content'>{children}</div>
      </div>
    </div>
  );
}
