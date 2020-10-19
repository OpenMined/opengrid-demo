import { Box } from '@chakra-ui/core';
import React from 'react';
import { Helmet } from 'react-helmet-async';

const DEFAULT_TITLE = 'OpenGrid';
const DEFAULT_DESCRIPTION =
  'OpenGrid is a registry of private datasets available for training and inference. Schedule a Duet with the data owner today!';
const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://opengrid.openmined.org';

export default ({
  children,
  title = '',
  description = DEFAULT_DESCRIPTION,
}) => {
  return (
    <Box
      width={{ base: '100%', lg: '90%', xl: '75%' }}
      px={{ base: 5, lg: 0 }}
      mx="auto"
      my={{ base: 5, lg: 6 }}
    >
      <Helmet
        defaultTitle={DEFAULT_TITLE}
        titleTemplate={`%s | ${DEFAULT_TITLE}`}
      >
        <html lang="en" amp />

        <base target="_blank" href={`${BASE_URL}/`} />
        <link rel="canonical" href={`${BASE_URL}${window.location.pathname}`} />

        <title itemProp="name" lang="en">
          {title}
        </title>
        <meta name="description" content={description} />
      </Helmet>
      {children}
    </Box>
  );
};
