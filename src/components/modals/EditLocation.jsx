import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import Wrapper from "../Wrapper";
import Button from "../Button";

const ContentContainer = styled.form`
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

const EditLocation = ({
  selectedItem,
  showModal,
  onClose,
  payRate,
  onConfirmUpdate,
}) => {
  const [formData, setFormData] = useState({
    location: selectedItem,
    payRate: payRate,
  });

  useEffect(() => {
    setFormData({ location: selectedItem, payRate });
  }, [selectedItem, payRate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirmUpdate(formData);
  };
  return (
    <Modal $isopen={showModal}>
      <Wrapper>
        <ContentContainer onSubmit={handleSubmit}>
          <h2>Edit {selectedItem}</h2>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder={selectedItem}
            value={formData.location}
            onChange={handleInputChange}
          />
          <label htmlFor="payRate">Pay Rate</label>
          <input
            type="number"
            id="payRate"
            name="payRate"
            value={formData.payRate}
            placeholder={payRate}
            onChange={handleInputChange}
          />
          <ButtonContainer>
            <Button type="submit">Save</Button>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
          </ButtonContainer>
        </ContentContainer>
      </Wrapper>
    </Modal>
  );
};

export default EditLocation;
