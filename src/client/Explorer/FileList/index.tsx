import React, { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import AppContext from '../../AppContext';
import { fetchApi } from '../../fetcher';
import { IFileItem, IResultForListFiles } from '../../types';

import FileItem from './FileItem';
import './index.less';

interface IProps {
  onChangeWorkPath: (value: string) => void;
}

export default function FileList({
  onChangeWorkPath
}: IProps): React.ReactElement {
  const { workPath } = useContext(AppContext);

  const [stateFileItems, setStateFileItems] = useState<IFileItem[]>([]);

  const fetchFileItems = async () => {
    const result = await fetchApi<IResultForListFiles>('listFiles', { workPath });
    setStateFileItems(result.fileItems.map(fileItem => {
      fileItem.fileUUID = uuidv4();
      return fileItem;
    }));
    if (result.workPath !== workPath) {
      onChangeWorkPath(result.workPath);
    }
  };

  useEffect(() => {
    fetchFileItems();
  }, [workPath]);

  const renderGroup = ({ title, dataSource }: {
    title: string;
    dataSource: IFileItem[];
  }) => {
    const [stateKeyword, setStateKeyword] = useState<string>('');
    const filteredDataSource = dataSource.filter(fileItem => fileItem.fileName.includes(stateKeyword));
    return (
      <div className="group">
        <div className="header">
          <div className="title">{`${title} / ${filteredDataSource.length}`}</div>
          <div className="extra">
            {dataSource.length > 1 && (
              <div className="filter">
                <input type="text" placeholder="filter by name" onChange={e => setStateKeyword(e.target.value)} />
              </div>
            )}
          </div>
        </div>
        <div className="content">
          {filteredDataSource.map((fileItem => (
            <FileItem
              key={fileItem.filePath}
              value={fileItem}
              onChangeWorkPath={fileItem.itemType !== 'file' ? onChangeWorkPath : undefined} />
          )))}
        </div>
      </div>
    );
  };

  const itemsForFiles: IFileItem[] = [];
  const itemsForDirectories: IFileItem[] = [];
  const itemsForOthers: IFileItem[] = [];
  stateFileItems.forEach(fileItem => {
    if (fileItem.itemType === 'file') {
      itemsForFiles.push(fileItem);
    } else if (fileItem.itemType === 'directory') {
      itemsForDirectories.push(fileItem);
    } else {
      itemsForOthers.push(fileItem);
    }
  });

  return (
    <div className="file-list">
      {renderGroup({ title: 'files', dataSource: itemsForFiles })}
      {renderGroup({ title: 'directories', dataSource: itemsForDirectories })}
      {renderGroup({ title: 'others', dataSource: itemsForOthers })}
    </div>
  );
}