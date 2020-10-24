import React from 'react';
import { unstable_createRoot } from 'react-dom';
import { FirebaseAppProvider } from 'reactfire';
import { HelmetProvider } from 'react-helmet-async';
import { ChakraProvider } from '@chakra-ui/core';

import App from './App';
import theme from './theme';

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
      <HelmetProvider>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </HelmetProvider>
    </FirebaseAppProvider>
  </React.StrictMode>
);

// Experimental concurrence mode in React
unstable_createRoot(root).render(<WrappedApp />);
