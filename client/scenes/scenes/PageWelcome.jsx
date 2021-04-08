import React from 'react'
import './PageWelcome.scss';

export default function PageWelcome() {
  return (
    <div className='container welcome'>
      <div className='header'>
        <a className='myself' href='/console'>FIRECELL</a>
        <a className='github' href='https://github.com/sartrey/firecell'>
          github.com/sartrey/firecell
        </a>
      </div>
    </div>
  );
}
