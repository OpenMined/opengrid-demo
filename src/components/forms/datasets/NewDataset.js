import React from 'react';
import * as yup from 'yup';
import * as firebase from 'firebase/app';
import { useFirestore, useUser } from 'reactfire';

import Form from '../_form';
import { requiredString, arraySize } from '../_validation';

import useToast, { toastConfig } from '../../Toast';

export default ({ callback }) => {
  const user = useUser();
  const db = useFirestore();
  const toast = useToast();
  const onSubmit = (data) => {
    if (!user) {
      toast({
        ...toastConfig,
        title: 'Error',
        description: 'You must be signed in to add a new dataset',
        status: 'error',
      });

      return;
    }

    data.tags = data.tags.map(({ value }) =>
      value.toLowerCase().split(' ').join('-').split('#').join('')
    );
    data.author = user.uid;
    data.upvotes = 0;
    data.created_at = firebase.firestore.Timestamp.now();

    return db
      .collection('datasets')
      .add(data)
      .then(() =>
        toast({
          ...toastConfig,
          title: 'Dataset added',
          description: `We've added your dataset "${data.name}"`,
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
      );
  };

  const TAGS_MIN = 1;
  const TAGS_MAX = 5;

  const schema = yup.object().shape({
    name: requiredString,
    description: requiredString,
    tags: arraySize(TAGS_MIN, TAGS_MAX),
  });

  const fields = [
    {
      name: 'name',
      type: 'text',
      placeholder: 'Type of the name of your dataset...',
      label: 'Name of Dataset',
    },
    {
      name: 'description',
      type: 'textarea',
      placeholder: 'Write a few sentences or paragraphs about your dataset...',
      label: 'Description',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      min: TAGS_MIN,
      max: TAGS_MAX,
      fields: [
        {
          name: 'value',
          type: 'text',
          placeholder: 'Tag name',
        },
      ],
    },
  ];

  return <Form onSubmit={onSubmit} schema={schema} fields={fields} />;
};
