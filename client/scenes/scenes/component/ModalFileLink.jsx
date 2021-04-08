import React, { useState, } from 'react'
import { Button, Input, Modal, } from '../../component/index';
import './ModalFileLink.scss';

export default function ModalFileLink(props) {
  const { context, file, onClose, onSubmit, } = props;
  const [error, setError] = useState(null);
  const [inputPath, setInputPath] = useState(file ? file.path : '');
  const [inputFrom, setInputFrom] = useState(file ? file.from : []);

  const submitChange = () => {
    setError(null);
    if (!inputPath) return setError('local path cannot be empty');
    if (!inputFrom) return setError('remote source cannot be empty');
    if (onSubmit) {
      onSubmit({ path: inputPath, from: inputFrom, });
    }
    if (onClose) {
      onClose();
    }
  }

  return (
    <Modal name='file-link' title='file link' onClose={onClose}>
      {/* { error && (
        <div className='text-halt'>{error}</div>
      ) } */}
      <div>
        <Input label='path' type='text' value={inputPath} onChange={e => setInputPath(e.target.value)} />
        <Input label='from' type='text' value={inputFrom} onChange={e => setInputFrom(e.target.value)} />
      </div>
      <div className='button-group'>
        <Button onClick={() => submitChange()} theme='large' icon='done' />
      </div>
    </Modal>
  );
}
