import React from 'react';
import { Heading, Flex, Avatar, Text, Box } from '@chakra-ui/core';
import { useUser, useFirestore, useFirestoreDocDataOnce } from 'reactfire';

import Page from '../../components/Page';
import GridContainer from '../../components/GridContainer';
import UpdatePassword from '../../components/forms/users/UpdatePassword';
import UpdateUser from '../../components/forms/users/UpdateUser';
import UploadProfilePhoto from '../../components/forms/users/UploadProfilePhoto';

export default () => {
  const user = useUser();
  const db = useFirestore();
  const userRef = db.collection('users').doc(user.uid);
  const userData = useFirestoreDocDataOnce(userRef);

  return (
    <Page title="Edit User">
      <GridContainer isInitial>
        <Box width={{ lg: '50%' }} mb={5}>
          <Heading as="h2" size="xl" mb={4}>
            Edit User
          </Heading>
          <UploadProfilePhoto
            placeholder={
              <Flex alignItems="center" cursor="pointer" mb={3}>
                <Avatar
                  src={userData.photoURL}
                  name={
                    userData.first_name + ' ' + userData.last_name ||
                    userData.email
                  }
                  size="lg"
                />
                <Text ml={4} color="gray.700" fontWeight="medium">
                  Click to change profile photo
                </Text>
              </Flex>
            }
          />
        </Box>
        <Box width={{ lg: '50%' }} mb={5}>
          <Heading as="h4" size="md" mb={4}>
            Profile Information
          </Heading>
          <UpdateUser />
          <Text size="sm" color="gray.700" mt={2}>
            <strong>Note:</strong> Changing the email address above is only for
            the email you would like to be contacted at, not the email address
            you use to sign in.
          </Text>
        </Box>
        <Box width={{ lg: '50%' }}>
          <Heading as="h3" size="lg" mb={4}>
            Change Password
          </Heading>
          <UpdatePassword />
        </Box>
      </GridContainer>
    </Page>
  );
};
