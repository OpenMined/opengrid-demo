import React from 'react';
import {
  SuspenseWithPerf,
  useUser,
  useFirestore,
  useFirestoreDocDataOnce,
  useFirestoreCollectionData,
} from 'reactfire';
import { Heading, Box } from '@chakra-ui/core';

import Loading from '../../components/Loading';
import Page from '../../components/Page';
import GridContainer from '../../components/GridContainer';
import Dataset from '../../components/Dataset';

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
          <SuspenseWithPerf fallback={<Loading />} traceId={'my-datasets'}>
            {adjustedDatasets.map((dataset, i) => (
              <Dataset {...dataset} key={i} mb={4} />
            ))}
          </SuspenseWithPerf>
        </Box>
      </GridContainer>
    </Page>
  );
};
