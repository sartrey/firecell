import React, { useState, useEffect } from 'react';
import ModalFileInfo from './component/ModalFileInfo';
import { requestAction } from '../action';
import './ConsoleDirect.scss';

function Section(props) {
  const { title, children } = props;
  return (
    <section>
      <h1 className='title'>{title}</h1>
      {children}
    </section>
  );
}

function FileList(props) {
  const { items } = props;
  return (
    <ul className='file-list'>
      {items.map((item, i) => (
        <li className='file-item' key={i}>
          <a onClick={item.action}>{item.text}</a>
        </li>
      ))}
    </ul>
  );
}

export default function ConsoleDirect(props) {
  const [keyword, setKeyword] = useState('');
  const [dirNode, setDirNode] = useState({ cwdir: '', files: [] });
  const [modalName, setModalName] = useState(null);
  const [modalData, setModalData] = useState(null);

  const accessDir = (path) => {
    return requestAction('getDirectFiles', { path })
      .then(({ model }) => {
        if (model) {
          setDirNode({ cwdir: model.cwdir, files: model.files });
          setKeyword('');
        }
      });
  };

  useEffect(() => {
    accessDir();
  }, []);

  const allItems = dirNode.files.filter(e => e.name.indexOf(keyword) >= 0);
  const fileItems = allItems.filter(e => e.type === 'file');
  const directoryItems = allItems.filter(e => e.type === 'directory');
  const otherItems = allItems.filter(e => e.type === 'other')

  const openModal = (name, data) => {
    setModalData(data);
    setModalName(name);
  };

  const closeModal = () => {
    setModalName(null);
  }

  return (
    <div className='console-direct'>
      <div className='cursor'>
        <p>current directory = {dirNode.cwdir}</p>
      </div>
      <div className='filter'>
        <input type='text' placeholder='filter query such as <keyword>' value={keyword} onChange={e => setKeyword(e.target.value)} />
      </div>
      <div>
        <Section title='quick'>
          <FileList items={[
            { text: '.. <parent>', action: () => accessDir('..'), },
            { text: '/ <root>', action: () => accessDir('/'), },
            { text: '~ <home>', action: () => accessDir('~'), },
          ]} />
        </Section>
        <Section title={`file / ${fileItems.length}`}>
          <FileList items={fileItems.map((e) => {
            return {
              text: e.name,
              action: () => openModal('file-info', e),
            };
          })} />
        </Section>
        <Section title={`directory / ${directoryItems.length}`}>
          <FileList items={directoryItems.map((e) => {
            return {
              text: e.name,
              action: () => accessDir(e.name)
            };
          })} />
        </Section>
        <Section title={`other / ${otherItems.length}`}>
          <FileList items={otherItems.map((e) => {
            return {
              text: e.name,
              action: () => {}
            };
          })} />
        </Section>
        { modalName === 'file-info' && (
          <ModalFileInfo context={props.context} file={modalData} onClose={closeModal} />
        ) }
      </div>
    </div>
  );
}
