import React from 'react';
import * as yup from 'yup';
import { useAuth } from 'reactfire';

import Form from './_form';
import { validEmail } from './_validation';

import { toast } from '../Toast';

export default () => {
  const auth = useAuth();
  const onSubmit = ({ email }) =>
    auth
      .sendPasswordResetEmail(email)
      .then(() => toast.success(`Password reset issued, check ${email}.`))
      .catch(({ message }) => toast.error(message));

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
