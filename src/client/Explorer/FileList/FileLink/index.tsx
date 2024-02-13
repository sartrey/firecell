import React from 'react';

import Action from '../../../components/Action';

import './index.less';

interface IProps {
  onReloadFileList: () => void;
}

export default function FileLink({
  onReloadFileList
}: IProps): React.ReactElement {
  const raiseCreateFileLink = () => {};

  const raiseReloadFileLinks = () => {};

  return (
    <div className="file-link">
      <Action icon="add_link" text="add link" onClick={raiseCreateFileLink} />
      <Action icon="sync" text="sync links" onClick={raiseReloadFileLinks} />
    </div>
  );
}