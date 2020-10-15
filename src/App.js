import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { useFirebase } from './firebase';
import { AppContext } from './context';

import Routes from './routes';
import Header from './components/Header';
import { ToastContainer } from './components/Toast';

/*
TODO:
- Add Suspense
- Add ReactFire
- Get FOUC and redirects fixed on React Router
- ... move on with your life
*/

const App = () => {
  const firebase = useFirebase();
  const [user, setUser] = useState(firebase.user);

  useEffect(() => {
    firebase.auth.onAuthStateChanged((authUser) => {
      authUser ? setUser(authUser) : setUser(null);
    });
  }, [firebase.auth]);

  return (
    <AppContext.Provider value={{ user }}>
      <Router>
        <Header />
        <Routes />
        <ToastContainer position="bottom-left" />
      </Router>
    </AppContext.Provider>
  );
};

export default App;
