import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useUser } from 'reactfire';

const Homepage = lazy(() => import('./Homepage'));
const EditUser = lazy(() => import('./users/EditUser'));
const MyDatasets = lazy(() => import('./datasets/MyDatasets'));
const NewDataset = lazy(() => import('./datasets/NewDataset'));
const NoMatch = lazy(() => import('./NoMatch'));

const Datasets = () => <div>Datasets</div>;
const Dataset = () => <div>Dataset</div>;
const EditDataset = () => <div>Edit Dataset</div>;

const AuthRoute = (props) => {
  const user = useUser();

  return user ? <Route {...props} /> : <Navigate to="/" />;
};

export default () => (
  <Routes>
    <Route path="/" element={<Homepage />} />
    <AuthRoute path="edit-user" element={<EditUser />} />
    <Route path="datasets">
      <Route path="/" element={<Datasets />} />
      <AuthRoute path="new" element={<NewDataset />} />
      <AuthRoute path="me" element={<MyDatasets />} />
      <Route path=":id">
        <Route path="/" element={<Dataset />} />
        <AuthRoute path="edit" element={<EditDataset />} />
      </Route>
    </Route>
    <Route path="*" element={<NoMatch />} />
  </Routes>
);
