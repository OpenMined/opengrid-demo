import React from 'react';
import * as yup from 'yup';
import { useAuth } from 'reactfire';

import Form from './_form';
import {
  validEmail,
  validPassword,
  validMatchingPassword,
} from './_validation';

import useToast, { toastConfig } from '../Toast';

export default ({ callback }) => {
  const auth = useAuth();
  const toast = useToast();
  const onSubmit = ({ email, password }) =>
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(() =>
        auth.currentUser
          .sendEmailVerification()
          .then(() =>
            toast({
              ...toastConfig,
              title: 'Sign up successful',
              description: 'Welcome to OpenGrid!',
              status: 'success',
            })
          )
          .then(() => !!callback && callback())
          .catch(({ message }) =>
            toast({
              ...toastConfig,
              title: 'Error',
              description: message,
              status: 'error',
            })
          )
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
    email: validEmail,
    password: validPassword,
    passwordConfirm: validMatchingPassword('password'),
  });

  const fields = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email address',
    },
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
