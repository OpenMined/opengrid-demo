import React from 'react';
import * as yup from 'yup';

import Form from './_form';
import { requiredString } from './_validation';
import { useFirebase } from '../firebase';

export default ({ user }) => {
  const firebase = useFirebase();
  const onSubmit = (data) => firebase.updateUser(data);

  const schema = yup.object().shape({
    displayName: requiredString,
  });

  const fields = [
    {
      name: 'displayName',
      type: 'text',
      placeholder: 'Full name',
      defaultValue: user.displayName || '',
    },
  ];

  return <Form onSubmit={onSubmit} schema={schema} fields={fields} />;
};
