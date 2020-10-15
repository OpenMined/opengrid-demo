import React from 'react';
import * as yup from 'yup';

import Form from './_form';
import { validPassword, validMatchingPassword } from './_validation';

import { useFirebase } from '../../firebase';

export default () => {
  const firebase = useFirebase();
  const onSubmit = ({ password }) => firebase.updatePassword(password);

  const schema = yup.object().shape({
    password: validPassword,
    passwordConfirm: validMatchingPassword('password'),
  });

  const fields = [
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
    },
    {
      name: 'passwordConfirm',
      type: 'password',
      placeholder: 'Password confirmation',
    },
  ];

  return <Form onSubmit={onSubmit} schema={schema} fields={fields} />;
};
