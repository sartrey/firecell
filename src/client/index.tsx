import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import PageEpiijs from './epiijs/index';
import PageEuler from './euler/index';
import PageStart from './start/index';
import './index.less';

export default function Application(): React.ReactElement {
  return (
    <div className="container">
      <BrowserRouter>
        <div className="actions">
          <Link to="/">start</Link>
          <Link to='/epiijs'>@epiijs</Link>
          <Link to='/euler'>e<sup>πi</sup>+1=0</Link>
        </div>
        <div className="content">
          <Routes>
            <Route path="/epiijs" element={<PageEpiijs />} />
            <Route path="/euler" element={<PageEuler />} />
            <Route path="/" element={<PageStart />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}