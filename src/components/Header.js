import React, { useState } from 'react';
import {
  Box,
  Image,
  Flex,
  Link,
  Button,
  Avatar,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  useDisclosure,
} from '@chakra-ui/core';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
  useUser,
  useAuth,
  useFirestore,
  useFirestoreDocDataOnce,
} from 'reactfire';
import { Link as RRDLink } from 'react-router-dom';

import useToast, { toastConfig } from './Toast';
import Modal from './Modal';

import SignIn from './forms/users/SignIn';
import SignUp from './forms/users/SignUp';
import ResetPassword from './forms/users/ResetPassword';

import { SearchBox } from '../routes/Search';

import logo from '../assets/logo.svg';

const UserAvatar = ({ user }) => {
  const db = useFirestore();
  const userData = useFirestoreDocDataOnce(
    db.collection('users').doc(user.uid)
  );

  return (
    <RRDLink to="/edit-user">
      <Avatar
        src={userData.photoURL}
        name={userData.first_name + ' ' + userData.last_name || userData.email}
        ml={3}
      />
    </RRDLink>
  );
};

export default () => {
  const user = useUser();
  const auth = useAuth();
  const toast = useToast();
  const signout = () =>
    auth
      .signOut()
      .then(() =>
        toast({
          ...toastConfig,
          title: 'Sign out successful',
          description: 'Come back soon!',
          status: 'success',
        })
      )
      .catch(({ message }) =>
        toast({
          ...toastConfig,
          title: 'Error',
          description: message,
          status: 'error',
        })
      );

  const [show, setShow] = useState(false);

  const [modalContent, setModalContent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const modalLinkClick = (content) => {
    setModalContent(content);
    onOpen();
  };

  const TextLink = ({ to, title, ...props }) => (
    <Link
      to={to}
      as={RRDLink}
      mt={{ base: 4, md: 0 }}
      mr={{ base: 0, md: 6 }}
      fontFamily="heading"
      textTransform="uppercase"
      fontWeight="medium"
      letterSpacing={1}
      color="gray.800"
      sx={{ '&:hover': { textDecoration: 'none', color: 'blue.500' } }}
      {...props}
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
        <Link to="/" as={RRDLink} ml={2} mr={4}>
          <Image src={logo} alt="OpenGrid" width="40px" height="40px" />
        </Link>
        <Box
          display={{ base: 'block', md: 'none' }}
          onClick={() => setShow(!show)}
        >
          {show ? <CloseIcon /> : <HamburgerIcon />}
        </Box>
        <Box
          display={{ base: show ? 'flex' : 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems="center"
          flexGrow={1}
        >
          {window.location.pathname === '/search' && (
            <SearchBox mt={{ base: 6, md: 0 }} mr={{ base: 0, md: 6 }} />
          )}
          {user && (
            <TextLink
              to="/datasets/new"
              display={{ base: 'block', md: 'none' }}
              title="Create Dataset"
            />
          )}
          {user && (
            <TextLink
              to="/models/new"
              display={{ base: 'block', md: 'none' }}
              title="Create Model"
            />
          )}
          {user && window.location.pathname !== '/search' && (
            <Menu>
              <MenuButton
                as={Button}
                colorScheme="blue"
                display={{ base: 'none', md: 'block' }}
                mt={{ base: 4, md: 0 }}
                mr={{ base: 0, md: 6 }}
                rightIcon={<ChevronDownIcon />}
              >
                Create New
              </MenuButton>
              <MenuList>
                <MenuItem as={RRDLink} to="/datasets/new">
                  Dataset
                </MenuItem>
                <MenuItem as={RRDLink} to="/models/new">
                  Model
                </MenuItem>
              </MenuList>
            </Menu>
          )}
          {user && window.location.pathname !== '/search' && (
            <TextLink to="/datasets/me" title="My Datasets" />
          )}
          {user && window.location.pathname !== '/search' && (
            <TextLink to="/models/me" title="My Models" />
          )}
          {!['/', '/search'].includes(window.location.pathname) && (
            <TextLink to="/search" title="Search" />
          )}
        </Box>
        <Box
          display={{ base: show ? 'flex' : 'none', md: 'flex' }}
          alignItems="center"
          justifyContent="center"
          flexGrow={{ base: 1, md: 0 }}
          mt={{ base: 4, md: 0 }}
        >
          {user && <SignOutButton />}
          {user && <UserAvatar user={user} />}
          {!user && <SignInButton />}
          {!user && <SignUpButton />}
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} {...modalContent} />
    </>
  );
};
