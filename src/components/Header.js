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
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useUser, useAuth } from 'reactfire';
import { Link as RRDLink } from 'react-router-dom';

import { toast } from './Toast';
import Modal from './Modal';

import SignIn from './forms/SignIn';
import SignUp from './forms/SignUp';
import ResetPassword from './forms/ResetPassword';

export default () => {
  const user = useUser();
  const auth = useAuth();
  const signout = () =>
    auth
      .signOut()
      .then(() => toast.success('Come back soon!'))
      .catch(({ message }) => toast.error(message));

  const [show, setShow] = useState(false);

  const [modalContent, setModalContent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const modalLinkClick = (content) => {
    setModalContent(content);
    onOpen();
  };

  const TextLink = ({ to, title }) => (
    <Link to={to} as={RRDLink} mt={{ base: 4, md: 0 }} mr={6} display="block">
      {title}
    </Link>
  );

  const SignInButton = () => (
    <Button
      onClick={() =>
        modalLinkClick({
          title: 'Sign in',
          content: (
            <SignIn
              callback={onClose}
              onResetPassword={() =>
                modalLinkClick({
                  title: 'Reset Password',
                  content: <ResetPassword />,
                })
              }
            />
          ),
        })
      }
    >
      Sign in
    </Button>
  );

  const SignUpButton = () => (
    <Button
      onClick={() =>
        modalLinkClick({
          title: 'Sign up',
          content: <SignUp callback={onClose} />,
        })
      }
    >
      Sign up
    </Button>
  );

  const SignOutButton = () => <Button onClick={signout}>Sign out</Button>;

  const UserAvatar = () => (
    <Avatar src={user.photoURL} name={user.displayName || user.email} />
  );

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
          {show ? <CloseIcon /> : <HamburgerIcon />}
        </Box>
        <Box
          display={{ base: show ? 'block' : 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
        >
          {user && <TextLink to="/edit-user" title="Edit User" />}
        </Box>
        <Box
          display={{ base: show ? 'block' : 'none', md: 'block' }}
          mt={{ base: 4, md: 0 }}
        >
          {user && <SignOutButton />}
          {user && <UserAvatar />}
          {!user && <SignInButton />}
          {!user && <SignUpButton />}
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} {...modalContent} />
    </>
  );
};
