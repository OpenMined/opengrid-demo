import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text } from '@chakra-ui/core';

export default ({
  onDrop,
  dragActive = 'Drop the files here...',
  placeholder = 'Drag and drop some files here, or click to select files',
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const containerProps =
    typeof placeholder !== 'string'
      ? { display: 'inline-block' }
      : {
          border: '2px',
          borderColor: 'gray.300',
          borderStyle: 'dashed',
          borderRadius: 'lg',
          p: 5,
        };

  return (
    <Box {...getRootProps()} {...containerProps}>
      <input {...getInputProps()} />
      {isDragActive ? (
        typeof dragActive === 'string' ? (
          <Text>{dragActive}</Text>
        ) : (
          dragActive
        )
      ) : typeof placeholder === 'string' ? (
        <Text>{placeholder}</Text>
      ) : (
        placeholder
      )}
    </Box>
  );
};
