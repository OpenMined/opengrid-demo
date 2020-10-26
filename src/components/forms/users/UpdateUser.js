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
    displayName: requiredString,
  });

  const fields = [
    {
      name: 'displayName',
      type: 'text',
      placeholder: 'Full name',
      defaultValue: userData.displayName || '',
    },
  ];

  return <Form onSubmit={onSubmit} schema={schema} fields={fields} />;
};
