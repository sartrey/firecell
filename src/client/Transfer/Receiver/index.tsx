import React, { useRef } from 'react';

import { fetchApi } from '../../fetcher';

import useQRScanner from './useQRScanner';
import './index.less';

export default function Receiver(): React.ReactElement {
  const refDebug = useRef<HTMLTextAreaElement>(null);

  const raiseUpload = async (input: string): Promise<void> => {
    const payload = JSON.parse(input);
    console.log({ payload });
    await fetchApi('pushFilePart', payload).then(() => {
      if (refDebug.current) {
        refDebug.current.value += `=> pushFilePart ${payload.taskId}\n`;
      }
    }).catch(error => {
      console.error(error);
    });
  };

  const {
    renderVideo,
    startScanner,
    closeScanner
  } = useQRScanner({
    onChangeResult: raiseUpload
  });

  const raiseStartChannel = (): void => {
    if (refDebug.current) {
      refDebug.current.value = '';
    }
    startScanner();
  };

  const raiseCloseChannel = (): void => {
    closeScanner();
  };

  return (
    <div className="receiver">
      <div className="area-side-channel">
        <div className="video">{renderVideo()}</div>
        <div className="debug">
          <textarea ref={refDebug} readOnly />
        </div>
      </div>
      <div className="controls">
        <button onClick={raiseStartChannel}>Start Channel</button>
        <button onClick={raiseCloseChannel}>Close Channel</button>
      </div>
    </div>
  );
}