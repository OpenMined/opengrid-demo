import React from 'react';
import { useStorage, useUser } from 'reactfire';

import FileUpload from '../FileUpload';
import { toast } from '../Toast';

export default () => {
  const storage = useStorage();
  const user = useUser();
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
      .then(() => toast.success('Profile photo uploaded!'))
      .catch(({ message }) => toast.error(message));
  };

  return <FileUpload onDrop={onDrop} />;
};
