import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useUser } from 'reactfire';

const Homepage = lazy(() => import('./Homepage'));
const EditUser = lazy(() => import('./EditUser'));
const NoMatch = lazy(() => import('./NoMatch'));

const About = () => <div>About</div>;
const AboutChild = () => <div>AboutChild</div>;
const AboutNest = () => <div>AboutNest</div>;

const AuthRoute = (props) => {
  const user = useUser();

  return user ? <Route {...props} /> : <Navigate to="/" />;
};

export default () => (
  <Routes>
    <Route path="/" element={<Homepage />} />
    <AuthRoute path="edit-user" element={<EditUser />} />
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
