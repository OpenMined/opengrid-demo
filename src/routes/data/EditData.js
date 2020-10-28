import React, { useEffect } from 'react';
import { Heading, Box } from '@chakra-ui/core';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';

import Page from '../../components/Page';
import GridContainer from '../../components/GridContainer';
import ComposeData from '../../components/forms/data/ComposeData';
import { useNavigate } from 'react-router-dom';

export default (props) => {
  const PAGE_MODE = window.location.pathname.includes('datasets')
    ? 'datasets'
    : 'models';

  const { uid } = useParams();
  const navigate = useNavigate();
  const user = useUser();
  const db = useFirestore();

  const dataRef = db.collection(PAGE_MODE).doc(uid);
  const dataData = useFirestoreDocDataOnce(dataRef);

  useEffect(() => {
    if (dataData.author !== user.uid) navigate('/');
  }, [dataData.author, user.uid, navigate]);

  return (
    <Page title={PAGE_MODE === 'datasets' ? 'Edit Dataset' : 'Edit Model'}>
      <GridContainer isInitial>
        <Box width={{ lg: '50%' }}>
          <Heading as="h2" size="xl" mb={4}>
            {PAGE_MODE === 'datasets' ? 'Edit Dataset' : 'Edit Model'}
          </Heading>
          <ComposeData
            data={dataData}
            uid={uid}
            callback={() => navigate(`/${PAGE_MODE}/me`)}
          />
        </Box>
      </GridContainer>
    </Page>
  );
};
