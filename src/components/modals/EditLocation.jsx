import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import Wrapper from "../Wrapper";
import Button from "../Button";
import { Close } from "@/icons";

const ContentContainer = styled.form`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 16px 16px;
  gap: 16px;
  border-radius: 4px;
  position: relative;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;
const CloseButton = styled(Button)`
  align-self: flex-end;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const EditLocation = ({
  selectedItem,
  showModal,
  onClose,
  onConfirmUpdate,
}) => {
  const [formData, setFormData] = useState({
    location: selectedItem?.location || "",
    payRate: selectedItem.payRate || "",
  });

  useEffect(() => {
    setFormData({
      location: selectedItem.location,
      payRate: selectedItem.payRate,
    });
  }, [selectedItem.location, selectedItem.payRate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.location || formData.location.trim() === "") {
      alert("Location name cannot be empty.");
      console.log("Location name cannot be empty.");
      return;
    }
    onConfirmUpdate(formData);
  };

  const handleCancel = () => {
    setFormData({
      locationName: "",
      payRate: "",
    });
    onClose();
  };

  return (
    <Modal $isopen={showModal}>
      <Wrapper>
        <ContentContainer onSubmit={handleSubmit}>
          <CloseButton variant="icon" type="button" onClick={handleCancel}>
            <Close color="black" />
          </CloseButton>
          <h2>Edit {formData.location}</h2>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder={selectedItem?.location}
            value={formData.location || ""}
            onChange={handleInputChange}
          />
          <label htmlFor="payRate">Pay Rate</label>
          <input
            type="number"
            id="payRate"
            name="payRate"
            value={formData.payRate || ""}
            placeholder={selectedItem?.payRate}
            onChange={handleInputChange}
          />
          <ButtonContainer>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                formData.location === selectedItem.location &&
                formData.payRate === selectedItem.payRate
              }
            >
              Save
            </Button>
          </ButtonContainer>
        </ContentContainer>
      </Wrapper>
    </Modal>
  );
};

export default EditLocation;
