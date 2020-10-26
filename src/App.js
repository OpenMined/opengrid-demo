import React, { Suspense, useEffect, useState, useLayoutEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { useAnalytics } from 'reactfire';

import Routes from './routes';

import Header from './components/Header';
import Loading from './components/Loading';

/*
TODO:
- Search for datasets
- Add dataset equialent for models
- Schedule an appointment with dataset/model owner
- Edit my appointments
- Delete an appointment
- View all my appointments (sent or received)
- Test all rules to make sure everything is correct
- Do responsive fixes
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
