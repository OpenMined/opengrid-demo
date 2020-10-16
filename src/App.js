import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useFirestoreDocData, useFirestore, SuspenseWithPerf } from 'reactfire';

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

function Burrito() {
  // lazy load the Firestore SDK and create a document reference
  const burritoRef = useFirestore().collection('tryreactfire').doc('burrito');

  // subscribe to the doc. just one line!
  const burrito = useFirestoreDocData(burritoRef);

  // get the value from the doc
  const isYummy = burrito.yummy;

  return <p>The burrito is {isYummy ? 'good' : 'bad'}</p>;
}

const App = () => {
  // const firebase = useFirebase();
  // const [user, setUser] = useState(firebase.user);

  // useEffect(() => {
  //   firebase.auth.onAuthStateChanged((authUser) => {
  //     authUser ? setUser(authUser) : setUser(null);
  //   });
  // }, [firebase.auth]);

  return (
    // <AppContext.Provider value={{ user }}>
    <Router>
      <SuspenseWithPerf
        fallback={'loading burrito status...'}
        traceId={'load-burrito-status'}
      >
        <Burrito />
      </SuspenseWithPerf>
      {/* <Header /> */}
      {/* <Routes /> */}
      <ToastContainer position="bottom-left" />
    </Router>
    // </AppContext.Provider>
  );
};

export default App;
