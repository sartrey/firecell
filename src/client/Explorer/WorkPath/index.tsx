import React, { useContext, useEffect, useRef } from 'react';

import AppContext from '../../AppContext';
import Action from '../../components/Action';

import './index.less';

interface IProps {
  onChangeWorkPath: (value: string) => void;
}

export default function WorkPath({
  onChangeWorkPath
}: IProps): React.ReactElement {
  const { workPath } = useContext(AppContext);

  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (refInput.current && workPath) {
      refInput.current.value = workPath;
    }
  }, [workPath]);

  const pathItems = [
    { label: 'parent', value: '..' },
    { label: 'root', value: '/' },
    { label: 'home', value: '~' },
    { label: 'library', value: '%' }
  ];

  return (
    <div className="work-path">
      <div className="input">
        <input type="text" ref={refInput} defaultValue={workPath} onKeyUp={e => {
          if (e.code === 'Enter' && refInput.current) {
            onChangeWorkPath(refInput.current.value);
          }
        }} />
      </div>
      <div className="quick">
        {pathItems.map(pathItem => (
          <Action key={pathItem.value} onClick={() => onChangeWorkPath(pathItem.value)}>
            <span className="value">{pathItem.value}</span>
            <span className="label">{pathItem.label}</span>
          </Action>
        ))}
      </div>
    </div>
  );
}