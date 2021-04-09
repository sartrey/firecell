import React, { useState, useEffect, } from 'react';
import { Alert, Button, } from '../component/index'
import ModalFileLink from './component/ModalFileLink'
import ModalFileInfo from './component/ModalFileInfo'
import { requestAction } from '../action';
import './ConsoleMirror.scss';

function mergeList(list1, list2, key) {
  const map = {};
  list1.forEach(e => map[e[key]] = e);
  list2.forEach(e => map[e[key]] = e);
  return Object.values(map);
}

function FileList(props) {
  const { items, onHandleFile, } = props;

  const openByShell = (path) => {
    return requestAction('openByShell', { path });
  }

  return (
    <ul className='file-list'>
      {items.map((item, i) => (
        <li className='file-item' key={i}>
          <div className='file-info path'>
            <a onClick={() => openByShell(item.path)}>{item.path}</a>
          </div>
          <div className='file-info from'>
            <a href={item.from} target='_blank'>{item.from}</a>
          </div>
          <div className='actions'>
            <Button onClick={e => onHandleFile('openFile', item)} theme='small' icon='qr_code_2' />
            <Button onClick={e => onHandleFile('linkFile', item)} theme='small' icon='edit' />
            <Button onClick={e => onHandleFile('syncFile', item)} theme='small' icon='sync' />
            <Button onClick={e => onHandleFile('killFile', item)} theme='small' icon='delete' />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ConsoleMirror(props) {
  const { context } = props;

  const [keyword, setKeyword] = useState('');
  const [fileLinks, setFileLinks] = useState([]);
  const [modalName, setModalName] = useState(null);
  const [modalData, setModalData] = useState(null);

  const showModal = (modal, data) => {
    setModalData(data);
    setModalName(modal);
  }

  const showAlert = (result) => {
    getFiles();
    const { alertHub } = context;
    if (result instanceof Error) {
      alertHub.append({ theme: 'halt', content: result.message, });
    } else {
      alertHub.append({ theme: 'done', content: result });
    }
  }

  const getFiles = (links) => {
    return requestAction('getMirrorFiles', { links })
      .then(({ model, error }) => {
        if (model) {
          // const links = mergeList(fileLinks, model, 'path');
          const links = model;
          setFileLinks(links);
        }
      });
  };

  const linkFile = (file) => {
    return requestAction('editFileLink', file)
      .then(({ error }) => {
        if (error) {
          showAlert(new Error(error));
        } else {
          getFiles();
          showAlert(`file link ${file.path} updated`);
        }
      });
  }

  const syncFile = (file) => {
    return requestAction('syncFileLink', file)
      .then(({ error }) => {
        if (error) {
          showAlert(new Error(error));
        } else {
          getFiles();
          showAlert(`file link ${file.path} fetched`);
        }
      });
  }

  const syncFiles = (files) => {
  }

  const killFile = (file) => {
    return requestAction('killFileLink', file)
      .then(({ error }) => {
        if (error) {
          showAlert(new Error(error));
        } else {
          getFiles();
          showAlert(`file link ${file.path} removed`)
        }
      });
  }

  const handleFile = (action, file) => {
    switch (action) {
      case 'openFile': {
        showModal('file-info', file);
        break;
      }
      case 'linkFile': {
        showModal('file-link', file);
        break;
      }
      case 'syncFile': {
        syncFile(file);
        break;
      }
      case 'killFile': {
        killFile(file);
        break;
      }
    }
  }

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <div className='console-mirror'>
      <div className='file-head'>
        <div className='actions button-group'>
          <Button icon='add' onClick={() => showModal('file-link')} />
          <Button icon='sync' onClick={() => syncFiles()} />
        </div>
        <p className='stat-info'>{fileLinks.length} file(s)</p>
      </div>
      <FileList items={fileLinks} onHandleFile={handleFile} />
      { modalName === 'file-info' && (
        <ModalFileInfo context={context} file={modalData} onClose={() => setModalName(null)} />
      ) }
      { modalName === 'file-link' && (
        <ModalFileLink context={context} file={modalData} onClose={() => setModalName(null)} onSubmit={linkFile} />
      ) }
    </div>
  )
}
