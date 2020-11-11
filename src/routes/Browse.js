import React, { useState } from 'react';
import { Box, Button, Flex, Heading } from '@chakra-ui/core';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

import Data from '../components/Data';
import Page from '../components/Page';
import GridContainer from '../components/GridContainer';

export default () => {
  const itemsPerPage = 20;
  const db = useFirestore();

  const [mode, setMode] = useState('datasets');

  const dataRef = db
    .collection(mode)
    .orderBy('upvotes', 'desc')
    .limit(itemsPerPage);
  const data = useFirestoreCollectionData(dataRef, { idField: 'uid' });

  return (
    <Page title="Browse">
      <GridContainer isInitial>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ md: 'center' }}
          mb={5}
        >
          <Heading as="h2" size="xl">
            Browse Top-Rated {mode === 'datasets' ? 'Datasets' : 'Models'}
          </Heading>
          <Button
            mt={{ base: 4, md: 0 }}
            onClick={() => setMode(mode === 'datasets' ? 'models' : 'datasets')}
          >
            Switch to {mode === 'datasets' ? 'Models' : 'Datasets'}
          </Button>
        </Flex>
        <Box>
          {data.length > 0 &&
            data.map((data, i) => (
              <Data {...data} mode={mode} key={i} mb={4} />
            ))}
          {data.length === 0 && (
            <Heading
              as="span"
              size="md"
              color="gray.700"
              display="block"
              mb={4}
            >
              There are no {mode}.
            </Heading>
          )}
        </Box>
      </GridContainer>
    </Page>
  );
};
