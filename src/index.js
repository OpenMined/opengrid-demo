import React from 'react';
import { unstable_createRoot } from 'react-dom';
import { ThemeProvider, theme, CSSReset } from '@chakra-ui/core';

import App from './App';
// import Firebase, { FirebaseContext } from './firebase';
import { FirebaseAppProvider } from 'reactfire';

// const firebase = new Firebase();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const root = document.getElementById('root');
const WrappedApp = () => (
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <App />
      </ThemeProvider>
    </FirebaseAppProvider>
  </React.StrictMode>
);
// const WrappedApp = () => (
//   <React.StrictMode>
//     <FirebaseContext.Provider value={firebase}>
//       <ThemeProvider theme={theme}>
//         <CSSReset />
//         <App />
//       </ThemeProvider>
//     </FirebaseContext.Provider>
//   </React.StrictMode>
// );

// Concurrent
unstable_createRoot(root).render(<WrappedApp />);

// Not concurrent
// render(<WrappedApp />, root);
