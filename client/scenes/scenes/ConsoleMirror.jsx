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

export default function ConsoleDirect(props) {
  const [keyword, setKeyword] = useState('');
  const [fileLinks, setFileLinks] = useState([]);
  const [modalName, setModalName] = useState(null);
  const [modalData, setModalData] = useState(null);

  const showModal = (modal, data) => {
    setModalData(data);
    setModalName(modal);
  }

  const getFiles = (links) => {
    return requestAction('getMirrorFiles', { links })
      .then(({ model }) => {
        if (model) {
          const links = mergeList(fileLinks, model, 'path');
          setFileLinks(links);
        }
      });
  };

  const linkFile = (file) => {
    return requestAction('editFileLink', file)
      .then(() => getFiles());
  }

  const syncFile = (file) => {
    return requestAction('syncFileLink', file);
  }

  const syncFiles = (files) => {
  }

  const killFile = (file) => {
    return requestAction('killFileLink', file)
      .then(() => getFiles());
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

  // pushAlert(type, body) {
  //   var { tings } = this.state
  //   tings.push({ type, body, time: new Date() })
  //   this.setState({ tings })
  // }

  // kickAlert(item) {
  //   var { tings } = this.state
  //   var index = tings.indexOf(item)
  //   tings.splice(index, 1)
  //   this.setState({ tings })
  // }

  // renderAlert() {
  //   var { tings } = this.state
  //   return (
  //     <div className='alert-hub'>
  //       {tings.sort((a, b) => b.time - a.time).map((alert, i) => (
  //         <Alert key={i} theme={alert.type}
  //           onClose={e => this.kickAlert(alert)}>
  //           {alert.body}
  //         </Alert>
  //       ))}
  //     </div>
  //   )
  // }

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
        <ModalFileInfo context={props.context} file={modalData} onClose={() => setModalName(null)} />
      ) }
      { modalName === 'file-link' && (
        <ModalFileLink context={props.context} file={modalData} onClose={() => setModalName(null)} onSubmit={linkFile} />
      ) }
      {/* {this.renderAlert()} */}
      </div>
  )
}
