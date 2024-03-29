import React, { useRef } from 'react';

import Explorer from './Explorer';
import Transfer from './Transfer';

import QRCode from './components/QRCode';
import Social from './components/Social';
import Action from './components/Action';
import { IOverlayHandler, Overlay } from './components/Overlay';
import AppContext, { useHostInfo, useWorkPath } from './AppContext';
import './index.less';

export default function Application(): React.ReactElement {
  const refOverlay = useRef<IOverlayHandler>();

  const { stateHostInfo } = useHostInfo();
  const { stateWorkPath, setStateWorkPath } = useWorkPath();

  const pathname = window.location.pathname;

  const popupQRCode = (): void => {
    if (!stateHostInfo || !refOverlay.current) { return; }
    const hrefForIntranet = `http://${stateHostInfo.hostIPv4}:${stateHostInfo.hostPort}${pathname}`;
    refOverlay.current.popup({
      content: <QRCode value={hrefForIntranet} />,
      popover: {
        anchor: '.menu #action-QR',
        // align: 'bottom-left'
      }
    });
  };

  return (
    <AppContext.Provider value={{
      hostInfo: stateHostInfo,
      workPath: stateWorkPath
    }}>
      <div className="container">
        <div className="header">
          <div className="logo">
            <a href="/">firecell</a>
          </div>
          <div className="menu">
            <Action text="QR" icon="qr_code" onClick={popupQRCode} />
            <Action href="/transfer" text="Transfer" icon="sync_alt" />
          </div>
          <div className="link">
            <Social name="twitter" />
            <Social name="github" />
          </div>
        </div>
        <div className="content">
          {pathname === '/transfer' && (
            <Transfer />
          )}
          {!['/transfer'].includes(pathname) && (
            <Explorer onChangeWorkPath={setStateWorkPath} />
          )}
        </div>
        <Overlay ref={refOverlay} />
      </div>
    </AppContext.Provider>
  );
}