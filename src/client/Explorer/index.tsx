import React from 'react';

import WorkPath from './WorkPath';
import FileList from './FileList';
import './index.less';

interface IProps {
  onChangeWorkPath: (value: string) => void;
}

export default function Explorer({
  onChangeWorkPath
}: IProps): React.ReactElement {
  const flushFileList = async () => {
    console.log('flushFileList');
  };

  return (
    <div className="explorer">
      <div className="toolbar">
        <WorkPath onChangeWorkPath={onChangeWorkPath} />
      </div>
      <FileList onChangeWorkPath={onChangeWorkPath} />
    </div>
  );
}