import React from 'react';
import { render } from 'react-dom';

import App from './App';
import Firebase, { FirebaseContext } from './firebase';

const root = document.getElementById('root');
const firebase = new Firebase();

render(
  <React.StrictMode>
    <FirebaseContext.Provider value={firebase}>
      <App />
    </FirebaseContext.Provider>
  </React.StrictMode>,
  root
);
