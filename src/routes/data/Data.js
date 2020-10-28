import React from 'react';
import { Heading, Box, Flex, Avatar, Text, Tag, Button } from '@chakra-ui/core';
import { TimeIcon } from '@chakra-ui/icons';
import { useParams, Link } from 'react-router-dom';
import {
  useFirestore,
  useFirestoreDocData,
  useFirestoreDocDataOnce,
  useUser,
} from 'reactfire';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as firebase from 'firebase/app';

import Page from '../../components/Page';
import GridContainer from '../../components/GridContainer';

dayjs.extend(relativeTime);

export default () => {
  const PAGE_MODE = window.location.pathname.includes('datasets')
    ? 'datasets'
    : 'models';

  const { uid } = useParams();
  const user = useUser();
  const db = useFirestore();

  const dataRef = db.collection(PAGE_MODE).doc(uid);
  const {
    name,
    description,
    author,
    created_at,
    updated_at,
    upvotes,
    tags,
  } = useFirestoreDocData(dataRef);

  const authorRef = db.collection('users').doc(author);
  const authorData = useFirestoreDocDataOnce(authorRef);

  const doUpvote = () => {
    db.collection(PAGE_MODE)
      .doc(uid)
      .update({
        upvotes: firebase.firestore.FieldValue.arrayUnion(user.uid),
      });
  };

  const doRemoveUpvote = () => {
    db.collection(PAGE_MODE)
      .doc(uid)
      .update({
        upvotes: firebase.firestore.FieldValue.arrayRemove(user.uid),
      });
  };

  return (
    <Page title={name}>
      <GridContainer isInitial>
        <Flex>
          <Box width={{ lg: 3 / 4 }} mr={8}>
            <Flex mb={4} align="center">
              <Heading as="h2" size="xl">
                {name}
              </Heading>
              {user && author === user.uid && (
                <Button
                  as={Link}
                  to={`/${PAGE_MODE}/${uid}/edit`}
                  ml={8}
                  colorScheme="blue"
                >
                  {PAGE_MODE === 'datasets' ? 'Edit Dataset' : 'Edit Model'}
                </Button>
              )}
              {user && author !== user.uid && !upvotes.includes(user.uid) && (
                <Button onClick={doUpvote} ml={8} colorScheme="yellow">
                  ★ Upvote
                </Button>
              )}
              {user && author !== user.uid && upvotes.includes(user.uid) && (
                <Button onClick={doRemoveUpvote} ml={8} colorScheme="gray">
                  ★ Remove Upvote
                </Button>
              )}
            </Flex>
            <Flex>
              <Flex align="center" mr={6}>
                <Avatar src={authorData.photoURL} size="xs" mr={2} />
                <Text fontWeight="bold">
                  {author.first_name} {author.last_name}
                </Text>
              </Flex>
              <Flex align="center" mr={6}>
                <TimeIcon mr={2} color="gray.500" />
                <Text color="gray.700">
                  Created {dayjs.unix(created_at.seconds).fromNow()}
                </Text>
              </Flex>
              <Flex align="center" mr={6}>
                <TimeIcon mr={2} color="gray.500" />
                <Text color="gray.700">
                  Updated {dayjs.unix(updated_at.seconds).fromNow()}
                </Text>
              </Flex>
              <Flex align="center">
                <Text color="yellow.500" mr={2}>
                  ★
                </Text>
                <Text color="gray.700">
                  {upvotes.length} upvote{upvotes.length !== 1 && 's'}
                </Text>
              </Flex>
            </Flex>
            <Flex mt={4}>
              {tags.map((t, i) => (
                <Link to={`/search?search=${t}&mode=${PAGE_MODE}`} key={t}>
                  <Tag colorScheme="blue" mr={i + 1 < tags.length ? 2 : 0}>
                    #{t}
                  </Tag>
                </Link>
              ))}
            </Flex>
            <Box mt={8} dangerouslySetInnerHTML={{ __html: description }} />
          </Box>
          <Box width={{ lg: 1 / 4 }}>
            {authorData.contact_email && (
              <Button
                as="a"
                size="lg"
                width="100%"
                href={`mailto:${authorData.contact_email}`}
              >
                Email {PAGE_MODE === 'datasets' ? 'Dataset' : 'Model'} Owner
              </Button>
            )}
          </Box>
        </Flex>
      </GridContainer>
    </Page>
  );
};
