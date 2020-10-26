import React from 'react';
import { Heading, Box } from '@chakra-ui/core';

import Page from '../../components/Page';
import GridContainer from '../../components/GridContainer';
import NewDataset from '../../components/forms/datasets/NewDataset';
import { useNavigate } from 'react-router-dom';

export default () => {
  const navigate = useNavigate();

  return (
    <Page title="Add New Dataset">
      <GridContainer isInitial>
        <Box width={{ lg: '50%' }} mb={5}>
          <Heading as="h2" size="xl" mb={4}>
            Add New Dataset
          </Heading>
          <NewDataset callback={() => navigate('/datasets/me')} />
        </Box>
      </GridContainer>
    </Page>
  );
};
