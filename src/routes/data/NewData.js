import React from 'react';
import { Heading, Box } from '@chakra-ui/core';

import Page from '../../components/Page';
import GridContainer from '../../components/GridContainer';
import ComposeData from '../../components/forms/data/ComposeData';
import { useNavigate } from 'react-router-dom';

export default () => {
  const PAGE_MODE = window.location.pathname.includes('datasets')
    ? 'datasets'
    : 'models';

  const navigate = useNavigate();

  return (
    <Page
      title={
        PAGE_MODE === 'datasets' ? 'Create New Dataset' : 'Create New Model'
      }
    >
      <GridContainer isInitial>
        <Box width={{ lg: '50%' }}>
          <Heading as="h2" size="xl" mb={4}>
            {PAGE_MODE === 'datasets'
              ? 'Create New Dataset'
              : 'Create New Model'}
          </Heading>
          <ComposeData callback={() => navigate(`/${PAGE_MODE}/me`)} />
        </Box>
      </GridContainer>
    </Page>
  );
};
