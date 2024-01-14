import React, { MouseEventHandler } from 'react';

import './index.less';

interface IProps {
  icon?: string;
  text?: string;
  href?: string;
  target?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
  children?: React.ReactNode;
}

export default function Action({
  icon,
  text,
  href,
  target,
  onClick,
  className,
  children
}: IProps): React.ReactElement {
  return (
    <a
      id={`action-${text}`}
      className={['action', className].filter(Boolean).join(' ')}
      onClick={onClick}
      href={href}
      target={target}>
      {children ? (
        children
      ) : (<>
        {icon && (<span className="icon material-icons">{icon}</span>)}
        {text && (<span className="text">{text}</span>)}
      </>)}
    </a>
  );
}