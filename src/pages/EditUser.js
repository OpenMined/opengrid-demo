import React from 'react';

import UpdatePassword from '../components/forms/UpdatePassword';
import UpdateUser from '../components/forms/UpdateUser';
import UploadProfilePhoto from '../components/forms/UploadProfilePhoto';

export default ({ user }) => (
  <>
    <UpdatePassword />
    <UpdateUser user={user} />
    <UploadProfilePhoto />
  </>
);
