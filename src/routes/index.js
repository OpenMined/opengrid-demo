import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useUser } from 'reactfire';

const Homepage = lazy(() => import('./Homepage'));
const EditUser = lazy(() => import('./users/EditUser'));
const Search = lazy(() => import('./Search'));
const Browse = lazy(() => import('./Browse'));
const NewData = lazy(() => import('./data/NewData'));
const MyData = lazy(() => import('./data/MyData'));
const Data = lazy(() => import('./data/Data'));
const EditData = lazy(() => import('./data/EditData'));
const NoMatch = lazy(() => import('./NoMatch'));

const AuthRoute = (props) => {
  const user = useUser();

  return user ? <Route {...props} /> : <Navigate to="/" />;
};

export default () => (
  <Routes>
    <Route path="/" element={<Homepage />} />
    <AuthRoute path="edit-user" element={<EditUser />} />
    <Route path="search" element={<Search />} />
    <Route path="browse" element={<Browse />} />
    <Route path="datasets">
      <AuthRoute path="new" element={<NewData />} />
      <AuthRoute path="me" element={<MyData />} />
      <Route path=":uid">
        <Route path="/" element={<Data />} />
        <AuthRoute path="edit" element={<EditData />} />
      </Route>
    </Route>
    <Route path="models">
      <AuthRoute path="new" element={<NewData />} />
      <AuthRoute path="me" element={<MyData />} />
      <Route path=":uid">
        <Route path="/" element={<Data />} />
        <AuthRoute path="edit" element={<EditData />} />
      </Route>
    </Route>
    <Route path="*" element={<NoMatch />} />
  </Routes>
);
