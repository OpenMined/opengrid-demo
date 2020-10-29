import React from 'react';
import * as yup from 'yup';
import { useUser, useFirestore, useFirestoreDocDataOnce } from 'reactfire';

import Form from '../_form';
import { requiredString } from '../_validation';

import useToast, { toastConfig } from '../../Toast';

export default () => {
  const user = useUser();
  const db = useFirestore();
  const toast = useToast();
  const onSubmit = (data) =>
    db
      .collection('users')
      .doc(user.uid)
      .set(data, { merge: true })
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

  const userRef = db.collection('users').doc(user.uid);
  const userData = useFirestoreDocDataOnce(userRef);

  const schema = yup.object().shape({
    first_name: requiredString,
    last_name: requiredString,
  });

  const fields = [
    [
      {
        name: 'first_name',
        type: 'text',
        label: 'Name',
        placeholder: 'First name',
        defaultValue: userData.first_name || '',
      },
      {
        name: 'last_name',
        type: 'text',
        placeholder: 'Last name',
        defaultValue: userData.last_name || '',
      },
    ],
    {
      name: 'calendly_link',
      type: 'text',
      label: 'Calendly Link',
      placeholder: 'your_scheduling_page',
      left: 'https://calendly.com/',
      defaultValue: userData.calendly_link || '',
    },
    {
      name: 'contact_email',
      type: 'text',
      label: 'Preferred contact',
      placeholder: 'Email address',
      defaultValue: userData.contact_email || '',
    },
  ];

  return <Form onSubmit={onSubmit} schema={schema} fields={fields} />;
};
