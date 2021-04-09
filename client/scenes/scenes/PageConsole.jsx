import React from 'react';
import { requestAction } from '../action';
import { Alert } from '../component';
import './PageConsole.scss';

import ConsoleMirror from './ConsoleMirror';
import ConsoleDirect from './ConsoleDirect';

export default function PageConsole(props) {
  const { context, onUpdateContext, } = props;
  const { mode, } = context;

  const switchMode = () => {
    requestAction('switchMode').then(({ error }) => {
      if (error) return;
      if (onUpdateContext) onUpdateContext();
    });
  }

  return (
    <div className='container console'>
      <header>
        <div className='logo'>firecell</div>
        <div className='mode' onClick={switchMode}>
          <div className={mode === 'mirror' ? 'active' : null}>Mirror</div>
          <div className={mode === 'direct' ? 'active' : null}>Direct</div>
        </div>
      </header>
      <div className='holder'>
        { mode === 'mirror' && (<ConsoleMirror context={context} />) }
        { mode === 'direct' && (<ConsoleDirect context={context} />) }
        <Alert.AlertHub onMount={e => context.alertHub = e} />
      </div>
      <footer />
    </div>
  );
}
