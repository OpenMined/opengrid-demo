import React, { useCallback } from 'react';

import { useFirebase } from '../firebase';
import FileUpload from '../components/file-upload';

export default () => {
  const firebase = useFirebase();
  const onDrop = useCallback(
    (files) => {
      firebase.uploadProfilePicture(files[0]);
    },
    [firebase]
  );

  return <FileUpload onDrop={onDrop} />;
};
