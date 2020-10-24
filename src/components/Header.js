import React, { useState } from 'react';
import {
  Box,
  Image,
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

import logo from '../assets/logo.svg';

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
    <Link
      to={to}
      as={RRDLink}
      mt={{ base: 4, md: 0 }}
      mr={6}
      fontFamily="heading"
      textTransform="uppercase"
      fontWeight="medium"
      letterSpacing={1}
      color="gray.800"
      sx={{ '&:hover': { textDecoration: 'none', color: 'blue.500' } }}
    >
      {title}
    </Link>
  );

  const SignInButton = () => (
    <Button
      colorScheme="blue"
      variant="outline"
      onClick={() =>
        modalLinkClick({
          title: 'Sign In',
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
      Sign In
    </Button>
  );

  const SignUpButton = () => (
    <Button
      colorScheme="blue"
      ml={3}
      onClick={() =>
        modalLinkClick({
          title: 'Sign Up',
          content: <SignUp callback={onClose} />,
        })
      }
    >
      Sign Up
    </Button>
  );

  const SignOutButton = () => (
    <Button colorScheme="blue" variant="outline" onClick={signout}>
      Sign Out
    </Button>
  );

  const UserAvatar = () => (
    <RRDLink to="edit-user">
      <Avatar
        src={user.photoURL}
        name={user.displayName || user.email}
        ml={3}
      />
    </RRDLink>
  );

  return (
    <>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding={3}
        bg="gray.50"
        shadow="base"
      >
        <Link to="/" as={RRDLink} ml={2} mr={6}>
          <Image src={logo} alt="OpenGrid" width="48px" height="48px" />
        </Link>
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
          display={{ base: show ? 'flex' : 'none', md: 'flex' }}
          alignItems="center"
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
