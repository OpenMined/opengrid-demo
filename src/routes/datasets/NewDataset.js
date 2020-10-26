import React from 'react';
import { Heading, Box } from '@chakra-ui/core';

import Page from '../../components/Page';
import GridContainer from '../../components/GridContainer';
import ComposeDataset from '../../components/forms/datasets/ComposeDataset';
import { useNavigate } from 'react-router-dom';

export default () => {
  const navigate = useNavigate();

  return (
    <Page title="Create New Dataset">
      <GridContainer isInitial>
        <Box width={{ lg: '50%' }}>
          <Heading as="h2" size="xl" mb={4}>
            Create New Dataset
          </Heading>
          <ComposeDataset callback={() => navigate('/datasets/me')} />
        </Box>
      </GridContainer>
    </Page>
  );
};
