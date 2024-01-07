import React from 'react';

import './index.less';

function GithubLink({ project, children }: {
  project: string;
  children: React.ReactNode;
}) {
  return (
    <a href={`https://github.com/${project}`} target="_blank">{children}</a>
  )
}

export default function PageEpiijs(): React.ReactElement {
  return (
    <div className="page-epiijs">
      <h1>@epiijs</h1>
      <ul>
        <li><GithubLink project="epiijs/server">@epiijs/server</GithubLink></li>  
        <li><GithubLink project="epiijs/client">@epiijs/client</GithubLink></li>  
        <li><GithubLink project="epiijs/inject">@epiijs/inject</GithubLink></li>  
        <li><GithubLink project="epiijs/config">@epiijs/config</GithubLink></li>  
      </ul>  
    </div>
  );
}