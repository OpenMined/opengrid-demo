import React from 'react';
import {
  SuspenseWithPerf,
  useUser,
  useFirestore,
  useFirestoreDocDataOnce,
  useFirestoreCollectionData,
} from 'reactfire';
import { Heading, Box, Button } from '@chakra-ui/core';

import Loading from '../../components/Loading';
import Page from '../../components/Page';
import GridContainer from '../../components/GridContainer';
import Dataset from '../../components/Dataset';
import { Link } from 'react-router-dom';

export default () => {
  const user = useUser();
  const db = useFirestore();

  const userRef = db.collection('users').doc(user.uid);
  const userData = useFirestoreDocDataOnce(userRef);

  const datasetsRef = db.collection('datasets').where('author', '==', user.uid);
  const datasets = useFirestoreCollectionData(datasetsRef, { idField: 'uid' });

  const adjustedDatasets = datasets.map((d) => ({ ...d, author: userData }));

  return (
    <Page title="My Datasets">
      <GridContainer isInitial>
        <Box width={{ lg: '50%' }} mb={5}>
          <Heading as="h2" size="xl" mb={4}>
            My Datasets
          </Heading>
        </Box>
        <Box>
          {adjustedDatasets.length > 0 && (
            <SuspenseWithPerf fallback={<Loading />} traceId={'my-datasets'}>
              {adjustedDatasets.map((dataset, i) => (
                <Dataset {...dataset} key={i} mb={4} />
              ))}
            </SuspenseWithPerf>
          )}
          {adjustedDatasets.length === 0 && (
            <>
              <Heading
                as="span"
                size="md"
                color="gray.700"
                display="block"
                mb={4}
              >
                You have no datasets
              </Heading>
              <Button as={Link} to="/datasets/new">
                Create a Dataset
              </Button>
            </>
          )}
        </Box>
      </GridContainer>
    </Page>
  );
};
