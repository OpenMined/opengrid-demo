import React, { Suspense, useEffect, useState, useLayoutEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { useAnalytics } from 'reactfire';

import Routes from './routes';

import Header from './components/Header';
import Loading from './components/Loading';

/*
TODO:
- Add Calendly integration
- Test all rules to make sure everything is correct
- Create stub data and test out all functionality
- Do responsive fixes
- Deploy live and make sure there are no major issues
*/

const Analytics = ({ location }) => {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.logEvent('page-view', { path_name: location.pathname });
  }, [location.pathname, analytics]);

  return null;
};

const history = createBrowserHistory();

const App = () => {
  const [action, setAction] = useState(history.action);
  const [location, setLocation] = useState(history.location);

  useLayoutEffect(() => {
    history.listen(({ location, action }) => {
      setLocation(location);
      setAction(action);
    });
  }, []);

  return (
    <Router action={action} location={location} navigator={history}>
      <Suspense fallback={<Loading />}>
        <Analytics location={location} />
        <Header />
        <Routes />
      </Suspense>
    </Router>
  );
};

export default App;
