import React from 'react';
import * as yup from 'yup';
import { useUser } from 'reactfire';

import Form from './_form';
import { requiredString } from './_validation';

import { toast } from '../Toast';

export default () => {
  const user = useUser();
  const onSubmit = (data) =>
    user
      .updateProfile(data)
      .then(() => toast.success('User profile updated successfully!'))
      .catch(({ message }) => toast.error(message));

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
