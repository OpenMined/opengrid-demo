import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useUser } from 'reactfire';

const Homepage = lazy(() => import('./Homepage'));
const EditUser = lazy(() => import('./users/EditUser'));
const Search = lazy(() => import('./Search'));
const NewDataset = lazy(() => import('./datasets/NewDataset'));
const MyDatasets = lazy(() => import('./datasets/MyDatasets'));
const Dataset = lazy(() => import('./datasets/Dataset'));
const EditDataset = lazy(() => import('./datasets/EditDataset'));
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
    <Route path="datasets">
      <AuthRoute path="new" element={<NewDataset />} />
      <AuthRoute path="me" element={<MyDatasets />} />
      <Route path=":uid">
        <Route path="/" element={<Dataset />} />
        <AuthRoute path="edit" element={<EditDataset />} />
      </Route>
    </Route>
    <Route path="*" element={<NoMatch />} />
  </Routes>
);
