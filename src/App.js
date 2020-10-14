import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { useFirebase } from './firebase';

import Signup from './forms/signup';
import Signin from './forms/signin';
import ResetPassword from './forms/reset-password';
import UpdatePassword from './forms/update-password';
import UpdateUser from './forms/update-user';
import UploadProfilePhoto from './forms/upload-profile-photo';

import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const firebase = useFirebase();
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth.onAuthStateChanged((authUser) => {
      authUser ? setUser(authUser) : setUser(null);
    });
  }, [firebase.auth]);

  return (
    <div>
      {user && (
        <img
          style={{ width: 100, height: 100 }}
          src={user.photoURL}
          alt={user.displayName || user.email}
        />
      )}
      {!user && <Signup />}
      {!user && <Signin />}
      {!user && <ResetPassword />}
      {user && <UpdatePassword />}
      {user && <UpdateUser user={user} />}
      {user && <UploadProfilePhoto />}
      {user && <button onClick={firebase.signout}>Sign out</button>}
      <ToastContainer position="bottom-left" />
    </div>
  );
};

export default App;
