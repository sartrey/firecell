import React, { useMemo } from 'react';

import Action from '../components/Action';

import Uploader from './Uploader';
import Receiver from './Receiver';
import './index.less';

export default function Transfer(): React.ReactElement {
  const workMode = useMemo(() => {
    const searchParams = new URL(window.location.href).searchParams;
    return searchParams.get('mode');
  }, [window.location.href]);

  return (
    <div className="transfer">
      <div className="work-mode">
        <Action text="uploader" href="/transfer?mode=uploader" />
        <Action text="receiver" href="/transfer?mode=receiver" />
      </div>
      <div className="work-area">
        {workMode === 'uploader' && (<Uploader />)}
        {workMode === 'receiver' && (<Receiver />)}
      </div>
    </div>
  );
}