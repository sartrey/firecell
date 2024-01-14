import React, { useMemo } from 'react';

const sizeUnit = ['B', 'KB', 'MB', 'GB', 'TB'];

export default function FileSize({
  value
}: {
  value: number;
}): React.ReactElement {
  const {
    nextValue,
    unitIndex
  } = useMemo(() => {
    let nextValue = value;
    let unitIndex = 0;
    while (nextValue > 1024) {
      nextValue /= 1024;
      unitIndex += 1;
    }
    return {
      nextValue,
      unitIndex
    };
  }, [value]);

  return (<>
    <span className="size">{nextValue.toFixed(unitIndex > 0 ? 2 : 0)}</span>
    <span className="unit">{sizeUnit[unitIndex]}</span>
  </>);
}