import React, { useState, useEffect, useRef } from 'react';
import * as yup from 'yup';
import * as firebase from 'firebase/app';
import { useFirestore, useUser } from 'reactfire';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/core';

import Form from '../_form';
import { requiredString, arraySize } from '../_validation';

import useToast, { toastConfig } from '../../Toast';

export default ({ data, uid, callback }) => {
  const [mode, setMode] = useState('create');

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const onDeleteClose = () => setIsDeleteOpen(false);
  const cancelRef = useRef();

  useEffect(() => {
    if (data) setMode('edit');
  }, [data]);

  const user = useUser();
  const db = useFirestore();
  const toast = useToast();
  const onSubmit = (d) => {
    if (!user) {
      toast({
        ...toastConfig,
        title: 'Error',
        description: `You must be signed in to ${
          mode ? 'add a new' : 'edit a'
        } dataset`,
        status: 'error',
      });

      return;
    }

    d.description = d.description.split('\n').join('<br />');
    d.tags = d.tags.map(({ value }) =>
      value.toLowerCase().split(' ').join('-').split('#').join('')
    );

    if (mode === 'create') {
      d.author = user.uid;
      d.upvotes = [];
      d.created_at = firebase.firestore.Timestamp.now();
      d.updated_at = d.created_at;

      return db
        .collection('datasets')
        .add(d)
        .then(() =>
          toast({
            ...toastConfig,
            title: 'Dataset added',
            description: `We've added your dataset "${d.name}"`,
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
    } else if (mode === 'edit') {
      d.updated_at = firebase.firestore.Timestamp.now();

      return db
        .collection('datasets')
        .doc(uid)
        .set(d, { merge: true })
        .then(() =>
          toast({
            ...toastConfig,
            title: 'Dataset update',
            description: `We've updated your dataset "${d.name}"`,
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
    }
  };

  const onDeleteDataset = () =>
    db
      .collection('datasets')
      .doc(uid)
      .delete()
      .then(() =>
        toast({
          ...toastConfig,
          title: 'Dataset deleted',
          description: `We've deleted your dataset "${data.name}"`,
          status: 'success',
        })
      )
      .then(() => onDeleteClose())
      .then(() => !!callback && callback())
      .catch(({ message }) =>
        toast({
          ...toastConfig,
          title: 'Error',
          description: message,
          status: 'error',
        })
      );

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
      defaultValue: data && data.name,
    },
    {
      name: 'description',
      type: 'textarea',
      placeholder: 'Write a few sentences or paragraphs about your dataset...',
      label: 'Description',
      defaultValue: data && data.description,
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      defaultValue: data && data.tags.map((t) => ({ value: t })),
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

  let extraFormProps =
    mode === 'edit'
      ? {
          submit: (
            <Button mt={4} mr={4} colorScheme="blue">
              Save Changes
            </Button>
          ),
          nextToSubmit: (
            <Button
              mt={4}
              onClick={() => setIsDeleteOpen(true)}
              colorScheme="red"
            >
              Delete Dataset
            </Button>
          ),
        }
      : {};

  return (
    <>
      <Form
        onSubmit={onSubmit}
        schema={schema}
        fields={fields}
        {...extraFormProps}
      />
      {mode === 'edit' && (
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Dataset
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to delete the "{data.name}" dataset? You
                can't undo this action afterwards.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={onDeleteDataset} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
};
