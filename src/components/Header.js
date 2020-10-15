import React, { useState } from 'react';
import {
  Box,
  Heading,
  Flex,
  Link,
  Button,
  Avatar,
  useDisclosure,
} from '@chakra-ui/core';
import { Link as RRDLink } from 'react-router-dom';

import Modal from './Modal';
import SignIn from './forms/SignIn';
import SignUp from './forms/SignUp';

import { useFirebase } from '../firebase';
import { useAppContext } from '../context';

export default (props) => {
  const { user } = useAppContext();
  const [show, setShow] = useState(false);

  const [modalContent, setModalContent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const firebase = useFirebase();

  const modalLinkClick = ({ dialog, ...link }) => {
    setModalContent({ ...link, content: dialog });
    onOpen();
  };

  return (
    <>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg="teal.500"
        color="white"
        {...props}
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg">
            <Link to="/" as={RRDLink}>
              Chakra UI
            </Link>
          </Heading>
        </Flex>

        <Box
          display={{ base: 'block', md: 'none' }}
          onClick={() => setShow(!show)}
        >
          <svg
            fill="white"
            width="12px"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </Box>

        <Box
          display={{ base: show ? 'block' : 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
        >
          {/* {links.map((link, i) => {
            const { title, path, dialog } = link;

            if (dialog) {
              return (
                <Link
                  key={i}
                  onClick={() => modalLinkClick(link)}
                  mt={{ base: 4, md: 0 }}
                  mr={6}
                  display="block"
                >
                  {title}
                </Link>
              );
            }

            if (path) {
              return (
                <Link
                  key={i}
                  as={RRDLink}
                  mt={{ base: 4, md: 0 }}
                  mr={6}
                  display="block"
                  to={path}
                >
                  {title}
                </Link>
              );
            }

            return null;
          })} */}
        </Box>

        <Box
          display={{ base: show ? 'block' : 'none', md: 'block' }}
          mt={{ base: 4, md: 0 }}
        >
          {user && <Button onClick={firebase.signout}>Sign out</Button>}
          {user && (
            <Avatar src={user.photoURL} name={user.displayName || user.email} />
          )}
          {!user && (
            <Button
              onClick={() =>
                modalLinkClick({ title: 'Sign in', dialog: <SignIn /> })
              }
            >
              Sign in
            </Button>
          )}
          {!user && (
            <Button
              onClick={() =>
                modalLinkClick({ title: 'Sign up', dialog: <SignUp /> })
              }
            >
              Sign up
            </Button>
          )}
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} {...modalContent} />
    </>
  );
};
