import React from 'react';
import * as yup from 'yup';
import { useUser } from 'reactfire';

import Form from './_form';
import { validPassword, validMatchingPassword } from './_validation';

import { toast } from '../Toast';

export default () => {
  const user = useUser();
  const onSubmit = ({ password }) =>
    user
      .updatePassword(password)
      .then(() => toast.success('Password updated successfully!'))
      .catch(({ message }) => toast.error(message));

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
