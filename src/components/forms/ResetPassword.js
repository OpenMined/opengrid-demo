import React from 'react';
import * as yup from 'yup';

import Form from './_form';
import { validEmail } from './_validation';

import { useFirebase } from '../../firebase';

export default () => {
  const firebase = useFirebase();
  const onSubmit = ({ email }) => firebase.resetPassword(email);

  const schema = yup.object().shape({
    email: validEmail,
  });

  const fields = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email address',
    },
  ];

  return <Form onSubmit={onSubmit} schema={schema} fields={fields} />;
};
