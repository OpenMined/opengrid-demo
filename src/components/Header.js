import React, { useContext, useEffect, useState } from 'react';
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
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  FormControl,
  FormLabel,
  Select,
  Text,
  useDisclosure,
} from '@chakra-ui/core';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
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

import logo from '../assets/logo.svg';
import { AppContext } from '../App';

const Search = () => {
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

  return (
    <Flex align="center">
      <Input
        type="text"
        bg="white"
        placeholder="Search for anything..."
        mr={2}
        width="320px"
        defaultValue={search}
        onChange={({ target }) => setSearch(target.value)}
      />
      <Popover>
        <PopoverTrigger>
          <Button variant="ghost">
            <SettingsIcon mr={2} />
            <Text>Filter & Sort</Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Filter & Sort</PopoverHeader>
          <PopoverBody>
            <FormControl id="mode" mb={2}>
              <FormLabel>Mode</FormLabel>
              <Select
                bg="white"
                onChange={({ target }) => setMode(target.value)}
                defaultValue={mode}
              >
                <option value="datasets">Datasets</option>
                <option value="models">Models</option>
              </Select>
            </FormControl>
            <FormControl id="tags" mb={2}>
              <FormLabel>Tags</FormLabel>
              <Input
                type="text"
                bg="white"
                placeholder="Search for specific tags..."
                defaultValue={tags}
                onChange={({ target }) => setTags(target.value)}
              />
            </FormControl>
            <FormControl id="sort" mb={2}>
              <FormLabel>Sort</FormLabel>
              <Select
                bg="white"
                onChange={({ target }) => setSort(target.value)}
                defaultValue={sort}
              >
                <option value="most-upvotes">Most Upvotes</option>
                <option value="least-upvotes">Least Upvotes</option>
              </Select>
            </FormControl>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};

const UserAvatar = ({ user }) => {
  const db = useFirestore();
  const userData = useFirestoreDocDataOnce(
    db.collection('users').doc(user.uid)
  );

  return (
    <RRDLink to="/edit-user">
      <Avatar
        src={userData.photoURL}
        name={userData.displayName || userData.email}
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
          display={{ base: show ? 'block' : 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
        >
          {window.location.pathname !== '/' && <Search />}
          {user && (
            <Menu>
              <MenuButton
                as={Button}
                colorScheme="blue"
                mt={{ base: 4, md: 0 }}
                mr={6}
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
          {user && <TextLink to="/datasets/me" title="My Datasets" />}
          {user && <TextLink to="/models/me" title="My Models" />}
        </Box>
        <Box
          display={{ base: show ? 'flex' : 'none', md: 'flex' }}
          alignItems="center"
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
