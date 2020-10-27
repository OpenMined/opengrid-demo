import React, { useContext, useEffect } from 'react';
import {
  SuspenseWithPerf,
  useUser,
  useFirestore,
  useFirestoreDocDataOnce,
  useFirestoreCollectionData,
} from 'reactfire';
import { Heading, Box, Button } from '@chakra-ui/core';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

import Loading from '../components/Loading';
import Page from '../components/Page';
import GridContainer from '../components/GridContainer';
import Dataset from '../components/Dataset';
import { AppContext } from '../App';

export default () => {
  const user = useUser();
  const db = useFirestore();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    search,
    setSearch,
    mode,
    setMode,
    tags,
    setTags,
    sort,
    setSort,
  } = useContext(AppContext);

  // TODO: The below breaks the search page... #awkward

  const paramsSearch = searchParams.get('search') || '';
  const paramsMode = searchParams.get('mode') || 'datasets';
  const paramsTags = searchParams.get('tags') || '';
  const paramsSort = searchParams.get('sort') || 'most-upvotes';

  useEffect(() => {
    setSearch(paramsSearch);
    setMode(paramsMode);
    setTags(paramsTags);
    setSort(paramsSort);
  }, [
    setSearch,
    setMode,
    setTags,
    setSort,
    paramsSearch,
    paramsMode,
    paramsTags,
    paramsSort,
  ]);

  useEffect(() => {
    const e = encodeURIComponent;

    navigate(
      `/search?search=${e(search)}&mode=${e(mode)}&tags=${e(tags)}&sort=${e(
        sort
      )}`
    );
  }, [search, mode, tags, sort, navigate]);

  return (
    <Page title="My Datasets">
      <GridContainer isInitial>
        <Box>
          {/* {datasets.length > 0 && (
            <SuspenseWithPerf fallback={<Loading />} traceId={'search'}>
              {adjustedDatasets.map((dataset, i) => (
                <Dataset {...dataset} key={i} mb={4} />
              ))}
            </SuspenseWithPerf>
          )}
          {datasets.length === 0 && (
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
          )} */}
        </Box>
      </GridContainer>
    </Page>
  );
};
