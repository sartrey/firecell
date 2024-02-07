import React, { useContext } from 'react';

import AppContext from '../../../AppContext';
import FileSize from '../../../components/FileSize';
import Action from '../../../components/Action';
import QRCode from '../../../components/QRCode';
import { useOverlay } from '../../../components/Overlay';
import { fetchApi } from '../../../fetcher';
import { IFileItem } from '../../../types';

import './index.less';

interface IProps {
  value: IFileItem;
  onChangeWorkPath?: (value: string) => void;
}

export default function FileItem({
  value,
  onChangeWorkPath
}: IProps): React.ReactElement {
  const overlay = useOverlay();

  const { hostInfo } = useContext(AppContext);

  const fileItemDOMId = `file-item-${value.fileUUID}`;

  const hrefForLocalHost = `http://localhost:${hostInfo?.hostPort}/proxy/${value.fileName}`;
  const hrefForIntranet = `http://${hostInfo?.hostIPv4}:${hostInfo?.hostPort}/proxy/${value.fileName}`;

  const raiseDefaultAction = (e: React.MouseEvent) => {
    if (value.itemType === 'directory') {
      onChangeWorkPath?.(value.filePath);
      return;
    }
    fetchApi('openFile', { filePath: value.filePath });
  };

  const popupQRCode = () => {
    overlay.popup({
      content: (
        <QRCode value={hrefForIntranet} />
      ),
      popover: {
        anchor: `#${fileItemDOMId} .links #action-QR`,
        // align: 'bottom-left'
      }
    });
  };

  const raiseOpenFileByShell = () => {
    fetchApi('openFile', { filePath: value.filePath });
  };

  return (
    <div id={fileItemDOMId} className="file-item" onClick={raiseDefaultAction}>
      <div className="title text-overflow">{value.fileName}</div>
      {value.itemType === 'file' && (<>
        <div className="extra">
          <div className="file-mime text-overflow">{value.mimeType}</div>
          <div className="file-size">
            <FileSize value={value.fileSize} />
          </div>
        </div>
        {hostInfo && (
          <div className="links">
            <Action text="localhost" target="_blank" href={hrefForLocalHost} icon="computer" />
            <Action text="intranet" target="_blank" href={hrefForIntranet} icon="lan" />
            {/* open by remote ip - icon public */}
            <Action text="QR" icon="qr_code_2" onClick={popupQRCode} />
            <Action text="shell" icon="open_in_new" onClick={raiseOpenFileByShell} />
          </div>
        )}
      </>)}
    </div>
  );
}