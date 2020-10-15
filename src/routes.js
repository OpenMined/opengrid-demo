import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAppContext } from './context';

import Homepage from './pages/Homepage';
import EditUser from './pages/EditUser';
import ResetPassword from './pages/ResetPassword';
import NoMatch from './pages/NoMatch';

const About = () => <div>About</div>;
const AboutChild = () => <div>AboutChild</div>;
const AboutNest = () => <div>AboutNest</div>;

const AuthRoute = (props) => {
  const { user } = useAppContext();

  return !!user ? <Route {...props} /> : <Navigate to="/" />;
};

const UnauthRoute = (props) => {
  const { user } = useAppContext();

  return !!user ? <Navigate to="/" /> : <Route {...props} />;
};

export default () => {
  const { user } = useAppContext();

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <AuthRoute path="edit-user" element={<EditUser user={user} />} />
      <UnauthRoute path="reset-password" element={<ResetPassword />} />
      <Route path="about">
        <Route path="/" element={<About />} />
        <Route path="child">
          <Route path="/" element={<AboutChild />} />
          <Route path="nest" element={<AboutNest />} />
        </Route>
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
};
