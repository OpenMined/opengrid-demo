import React from 'react';
import * as yup from 'yup';
import { useAuth } from 'reactfire';

import Form from './_form';
import {
  validEmail,
  validPassword,
  validMatchingPassword,
} from './_validation';

import { toast } from '../Toast';

export default ({ callback }) => {
  const auth = useAuth();
  const onSubmit = ({ email, password }) =>
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(() =>
        auth.currentUser
          .sendEmailVerification()
          .then(() => toast.success('Signup successful, welcome to OpenGrid!'))
          .then(() => !!callback && callback())
          .catch(({ message }) => toast.error(message))
      )
      .catch(({ message }) => toast.error(message));

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
