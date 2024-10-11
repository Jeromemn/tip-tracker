import React from "react";
import styled from "styled-components";
import Modal from "./Modal";
import Wrapper from "../Wrapper";
import Button from "../Button";

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 16px 16px;
  gap: 16px;
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

const DeleteModal = ({ selectedItem, showModal, onClose, onConfirmDelete }) => {
  return (
    <Modal $isopen={showModal}>
      <Wrapper>
        <ContentContainer>
          <h2>Are you sure you want to delete {selectedItem.location}?</h2>
          <ButtonContainer>
            <Button variant="warning" onClick={onConfirmDelete}>
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ButtonContainer>
        </ContentContainer>
      </Wrapper>
    </Modal>
  );
};

export default DeleteModal;
