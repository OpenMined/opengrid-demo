import React, { useEffect, useState } from 'react';
import { Box, Heading } from '@chakra-ui/core';
import { useFirestore } from 'reactfire';

import Data from '../components/Data';
import Page from '../components/Page';
import GridContainer from '../components/GridContainer';

export default () => {
  const [mode] = useState('datasets');
  const [results, setResults] = useState([]);
  const [itemsPerPage] = useState(20);

  const db = useFirestore();

  useEffect(() => {
    db.collection('datasets')
      .orderBy('upvotes', 'desc')
      .limit(itemsPerPage)
      .get()
      .then((collection) => {
        const items = collection.docs.map((item) => item.data());
        setResults(items);
      });
  }, [itemsPerPage, db]);

  return (
    <Page title="Browse">
      <GridContainer isInitial>
        <Box>
          {results.length > 0 &&
            results.map((data, i) => (
              <Data {...data} mode={mode} key={i} mb={4} />
            ))}
          {results.length === 0 && (
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
