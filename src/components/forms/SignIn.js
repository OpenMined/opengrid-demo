import React from 'react';
import * as yup from 'yup';
import { Link } from '@chakra-ui/core';
import { Link as RRDLink } from 'react-router-dom';

import Form from './_form';
import { validEmail, validPassword } from './_validation';

import { useFirebase } from '../../firebase';

export default () => {
  const firebase = useFirebase();
  const onSubmit = ({ email, password }) => firebase.signin(email, password);

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
      <Link as={RRDLink} to="/reset-password">
        Reset your password
      </Link>
    </>
  );
};
