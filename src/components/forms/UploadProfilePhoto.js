import React, { useCallback } from 'react';

import FileUpload from '../FileUpload';
import { useFirebase } from '../../firebase';

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
