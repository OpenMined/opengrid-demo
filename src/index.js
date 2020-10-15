import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider, theme, CSSReset } from '@chakra-ui/core';

import App from './App';
import Firebase, { FirebaseContext } from './firebase';

const root = document.getElementById('root');
const firebase = new Firebase();

render(
  <React.StrictMode>
    <FirebaseContext.Provider value={firebase}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <App />
      </ThemeProvider>
    </FirebaseContext.Provider>
  </React.StrictMode>,
  root
);
