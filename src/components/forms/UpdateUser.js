import React from 'react';
import * as yup from 'yup';
import { useUser } from 'reactfire';

import Form from './_form';
import { requiredString } from './_validation';

import useToast, { toastConfig } from '../Toast';

export default () => {
  const user = useUser();
  const toast = useToast();
  const onSubmit = (data) =>
    user
      .updateProfile(data)
      .then(() =>
        toast({
          ...toastConfig,
          title: 'User update successful',
          description: 'Way to keep your account up to date!',
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
