import React, { useState, useEffect, } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { requestAction } from './action';
import PageConsole from './scenes/PageConsole';
import PageWelcome from './scenes/PageWelcome';

import './index.scss';

export default function App() {
  const [context, setContext] = useState({});

  const getContext = () => {
    return requestAction('getContext')
      .then(({ model }) => {
        if (model) {
          setContext(model);
        }
      });
  }

  useEffect(() => {
    getContext();
  }, []);

  return (
    <Router>
      <Switch>
        <Route path='/console'>
          <PageConsole context={context} onUpdateContext={getContext} />
        </Route>
        <Route path='/'>
          <PageWelcome />
        </Route>
      </Switch>
    </Router>
  );
}
