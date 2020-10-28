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
import Data from '../../components/Data';
import { Link } from 'react-router-dom';

export default () => {
  const PAGE_MODE = window.location.pathname.includes('datasets')
    ? 'datasets'
    : 'models';

  const user = useUser();
  const db = useFirestore();

  const userRef = db.collection('users').doc(user.uid);
  const userData = useFirestoreDocDataOnce(userRef);

  const dataRef = db.collection(PAGE_MODE).where('author', '==', user.uid);
  const data = useFirestoreCollectionData(dataRef, { idField: 'uid' });

  const adjustedData = data.map((d) => ({ ...d, author: userData }));

  return (
    <Page title={PAGE_MODE === 'datasets' ? 'My Datasets' : 'My Models'}>
      <GridContainer isInitial>
        <Box width={{ lg: '50%' }} mb={5}>
          <Heading as="h2" size="xl" mb={4}>
            {PAGE_MODE === 'datasets' ? 'My Datasets' : 'My Models'}
          </Heading>
        </Box>
        <Box>
          {adjustedData.length > 0 && (
            <SuspenseWithPerf
              fallback={<Loading />}
              traceId={`my-${PAGE_MODE}`}
            >
              {adjustedData.map((d, i) => (
                <Data {...d} key={i} mb={4} />
              ))}
            </SuspenseWithPerf>
          )}
          {adjustedData.length === 0 && (
            <>
              <Heading
                as="span"
                size="md"
                color="gray.700"
                display="block"
                mb={4}
              >
                You have no {PAGE_MODE}
              </Heading>
              <Button as={Link} to={`/${PAGE_MODE}/new`}>
                Create a {PAGE_MODE === 'datasets' ? 'Dataset' : 'Model'}
              </Button>
            </>
          )}
        </Box>
      </GridContainer>
    </Page>
  );
};
