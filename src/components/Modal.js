import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/core';

export default ({ isOpen, onClose, content, title, buttons }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{content}</ModalBody>
        {buttons && <ModalFooter>{buttons}</ModalFooter>}
      </ModalContent>
    </ModalOverlay>
  </Modal>
);
