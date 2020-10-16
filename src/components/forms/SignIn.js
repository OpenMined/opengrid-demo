import React from 'react';
import * as yup from 'yup';
import { Link } from '@chakra-ui/core';
import { useAuth } from 'reactfire';

import Form from './_form';
import { validEmail, validPassword } from './_validation';

import { toast } from '../Toast';

export default ({ callback, onResetPassword }) => {
  const auth = useAuth();
  const onSubmit = ({ email, password }) =>
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => toast.success('Welcome back!'))
      .then(() => !!callback && callback())
      .catch(({ message }) => toast.error(message));

  const schema = yup.object().shape({
    email: validEmail,
    password: validPassword,
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
  ];

  return (
    <>
      <Form onSubmit={onSubmit} schema={schema} fields={fields} />
      <Link onClick={() => !!onResetPassword && onResetPassword()}>
        Reset your password
      </Link>
    </>
  );
};
