import React, { Suspense, useEffect, useState, useLayoutEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { useAnalytics } from 'reactfire';

import Routes from './routes';

import Header from './components/Header';
import { ToastContainer } from './components/Toast';
import Loading from './components/Loading';

/*
TODO:
- Redo the toast styling to look like Chakra
- Add dataset/model (same thing)
- Edit dataset/model
- Delete dataset/model
- View individual dataset/model
- Manage my datasets/models
- Search for datasets/models
- Schedule an appointment with dataset/model owner
- Edit my appointments
- Delete an appointment
- View all my appointments (sent or received)
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
        <ToastContainer position="bottom-left" />
      </Suspense>
    </Router>
  );
};

export default App;
