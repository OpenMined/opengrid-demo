import React from 'react';
import * as yup from 'yup';
import { useUser } from 'reactfire';

import Form from '../_form';
import { validPassword, validMatchingPassword } from '../_validation';

import useToast, { toastConfig } from '../../Toast';

export default () => {
  const user = useUser();
  const toast = useToast();
  const onSubmit = ({ password }) =>
    user
      .updatePassword(password)
      .then(() =>
        toast({
          ...toastConfig,
          title: 'Password update successful',
          description: 'Way to keep your account safe!',
          status: 'success',
        })
      )
      .catch(({ message }) =>
        toast({
          ...toastConfig,
          title: 'Error',
          description: message,
          status: 'error',
        })
      );

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
