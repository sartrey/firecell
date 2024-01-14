import React from 'react';

import Action from '../../components/Action';

import './index.less';

interface IProps {
  onCreateFileLink: () => void;
}

export default function FileLink({
  onCreateFileLink
}: IProps): React.ReactElement {
  const raiseCreateFileLink = () => {};

  return (
    <div className="file-link">
      <Action icon="add_link" text="add link" onClick={raiseCreateFileLink} />
      <Action icon="sync" text="sync links" onClick={raiseCreateFileLink} />
    </div>
  );
}