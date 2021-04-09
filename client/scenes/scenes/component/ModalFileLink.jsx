import React, { useState, } from 'react'
import { Button, Input, Modal, } from '../../component/index';
import './ModalFileLink.scss';

export default function ModalFileLink(props) {
  const { context, file, onClose, onSubmit, } = props;
  const [inputPath, setInputPath] = useState(file ? file.path : '');
  const [errorPath, setErrorPath] = useState(file ? file.path : '');
  const [inputFrom, setInputFrom] = useState(file ? file.from : '');
  const [errorFrom, setErrorFrom] = useState(file ? file.from : '');

  const submitChange = () => {
    if (!inputPath || !/^\/\S+$/.test(inputPath)) {
      return setErrorPath('<path> must be like /a/b/c...');
    }
    setErrorPath(null);
    if (!inputFrom || !/^(https?:)?\/\/\S+/.test(inputFrom)) {
      return setErrorFrom('<from> must be like a valid URL');
    }
    setErrorFrom(null);
    onSubmit({ path: inputPath, from: inputFrom, });
    onClose();
  }

  return (
    <Modal name='file-link' title='file link' onClose={onClose}>
      <div>
        <Input label='path' type='text' error={errorPath} value={inputPath} onChange={e => setInputPath(e.target.value)} />
        <Input label='from' type='text' error={errorFrom} value={inputFrom} onChange={e => setInputFrom(e.target.value)} />
      </div>
      <div className='button-group'>
        <Button onClick={() => submitChange()} theme='large' icon='done' />
      </div>
    </Modal>
  );
}
