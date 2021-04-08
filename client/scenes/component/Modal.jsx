import React, { useEffect, } from 'react';
import './Modal.scss';

export default function Modal(props) {
  const { children, disabled, footer, name, title, onClose } = props;

  const closeModal = () => {
    if (onClose) onClose();
  }

  // useEffect(() => {
  // }, []);

  return (
    <div className={`modal modal-${name} ${disabled ? 'disabled' : ''}`} onClick={closeModal}>
      <div className='dialog' onClick={e => e.stopPropagation()}>
        <div className='header'>
          <div className='title'>{title}</div>
          <div className='close'>
            <a onClick={closeModal}><i className='md-icons'>close</i></a>
          </div>
        </div>
        <div className='content'>
          {children}
        </div>
        {footer && (
          <div className='footer'>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
