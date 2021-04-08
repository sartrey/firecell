import React from 'react';
import QRCode from 'qrcode.react';
import { Modal, } from '../../component/index';
import { requestAction } from '../../action';
import './ModalFileInfo.scss';

function autoUnit(size) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let depth = 0;
  while (size > 1024) {
    size = size / 1024;
    depth ++;
  }
  return { size, unit: units[depth] };
}

function InfoLine(props) {
  const { title, content, action } = props;
  return (
    <div className='line'>
      <h1>{title}</h1>
      <p>
        {action ? (
          typeof action === 'function' ? (
            <a onClick={action}>{content}</a>
          ) : (
            <a href={action} target='_blank'>{content}</a>
          )
        ) : content}
      </p>
    </div>
  );
}

export default function ModalFileInfo(props) {
  const { context, file, onClose, } = props;
  const { ipv4 = [], port = 0, } = context;
  const disabled = file.size < 0;

  const sizeValue = autoUnit(file.size);
  const sizeText = disabled ? '/* local copy not found */' : (sizeValue.size.toFixed(2) + ' ' + sizeValue.unit);
  const httpURL = `http://${ipv4[0]}:${port}/__data/accessFile?path=${encodeURIComponent(file.path)}`;
  const httpText = `http://firecell${file.path.startsWith('/') ? file.path : `/${file.path}`}`;

  const openByShell = (path) => {
    return requestAction('openByShell', { path });
  }

  return (
    <Modal name='file-info' title='file info' disabled={disabled} onClose={onClose}>
      <div className='qrcode'>
        <QRCode value={httpURL} size={160} level='M' fgColor={disabled ? '#ccc' : '#333'} />
      </div>
      <div className='detail'>
        <InfoLine title='name' content={file.name || file.path} />
        <InfoLine title='size' content={sizeText} />
        <InfoLine title='path' content={file.path} action={() => openByShell(file.path)} />
        <InfoLine title='http' content={httpText} action={httpURL} />
      </div>
    </Modal>
  );
}
