import { createContext, useContext } from 'react';

import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import { toast } from '../components/Toast';

export const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

class Firebase {
  constructor() {
    app.initializeApp({
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
      measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    });

    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();

    this.user = this.auth.currentUser;
  }

  // Auth
  setUser = (user) => (this.user = user);
  signup = (email, password) =>
    this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(() =>
        this.user
          .sendEmailVerification()
          .then(() => toast.success('Signup successful, welcome to OpenGrid!'))
          .catch(({ message }) => toast.error(message))
      )
      .catch(({ message }) => toast.error(message));

  signin = (email, password) =>
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => toast.success('Welcome back!'))
      .catch(({ message }) => toast.error(message));

  signout = () =>
    this.auth
      .signOut()
      .then(() => toast.success('Come back soon!'))
      .catch(({ message }) => toast.error(message));

  resetPassword = (email) =>
    this.auth
      .sendPasswordResetEmail(email)
      .then(() => toast.success(`Password reset issued, check ${email}.`))
      .catch(({ message }) => toast.error(message));

  updatePassword = (password) =>
    this.user
      .updatePassword(password)
      .then(() => toast.success('Password updated successfully!'))
      .catch(({ message }) => toast.error(message));

  updateUser = (data) =>
    this.user
      .updateProfile(data)
      .then(() => toast.success('User profile updated successfully!'))
      .catch(({ message }) => toast.error(message));

  // DB

  // Storage
  uploadProfilePicture = (file) => {
    const storageRef = this.storage.ref(this.user.uid + '/photos/' + file.name);

    return storageRef
      .put(file)
      .then(() =>
        storageRef.getDownloadURL().then((photoURL) =>
          this.user.updateProfile({
            photoURL,
          })
        )
      )
      .then(() => toast.success('Profile photo uploaded!'))
      .catch(({ message }) => toast.error(message));
  };
}

export default Firebase;
