import React from 'react';
import { useStorage, useUser } from 'reactfire';

import FileUpload from '../FileUpload';
import useToast, { toastConfig } from '../Toast';

export default ({ callback, placeholder, dragActive }) => {
  const storage = useStorage();
  const user = useUser();
  const toast = useToast();
  const onDrop = (files) => {
    const file = files[0];
    const storageRef = storage.ref(user.uid + '/photos/' + file.name);

    storageRef
      .put(file)
      .then(() =>
        storageRef.getDownloadURL().then((photoURL) =>
          user.updateProfile({
            photoURL,
          })
        )
      )
      .then(() =>
        toast({
          ...toastConfig,
          title: 'Profile photo uploaded',
          description: 'Way to keep your account up to date!',
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

  return (
    <FileUpload
      onDrop={onDrop}
      placeholder={placeholder}
      dragActive={dragActive}
    />
  );
};
