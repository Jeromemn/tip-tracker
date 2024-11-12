import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import Wrapper from "../Wrapper";
import Button from "../Button";
import Input from "../Input";
import { useSession } from "next-auth/react";
import { Close } from "@/icons";

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 24px;
  background-color: white;
  position: relative;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: end;
  gap: 16px;
`;

const CloseButton = styled(Button)`
  align-self: flex-end;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const AddLocationModal = ({ showModal, company, onClose, onLocationAdded }) => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    locationName: "",
    payRate: 0,
  });

  // selected company is an object with id and name properties

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!session) {
      alert("You must be signed in to add a location.");
      return;
    }

    const cleanedFormData = {
      companyId: company._id,
      location: formData.locationName,
      payRate: formData.payRate,
      userId: session.user.id,
    };

    try {
      const response = await fetch("/api/companies/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedFormData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Location added successfully:", result);
        onLocationAdded(result, company._id);
        setFormData({
          locationName: "",
          payRate: 0,
        });

        document.getElementById("SubmitForm").reset();
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error creating location:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      locationName: "",
      payRate: 0,
    });
    onClose();
  };

  return (
    <Modal $isopen={showModal}>
      <Wrapper>
        <FormWrapper onSubmit={handleSubmit} id="SubmitForm">
          <CloseButton type="button" variant="icon" onClick={handleCancel}>
            <Close color="black" />
          </CloseButton>
          <h2>{company?.name} new location </h2>
          <Input
            label="Location Name"
            type="text"
            placeholder="Enter location name"
            value={formData.location || ""}
            name="locationName"
            onChange={(event) => handleInputChange(event)}
          />
          <Input
            label="Pay Rate"
            type="number"
            placeholder="Enter pay rate"
            value={formData.payRate}
            name="payRate"
            onChange={(event) => handleInputChange(event)}
            step="0.01"
          />
          <ButtonWrapper>
            <Button type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!formData.locationName || !formData.payRate}
            >
              Submit
            </Button>
          </ButtonWrapper>
        </FormWrapper>
      </Wrapper>
    </Modal>
  );
};

export default AddLocationModal;
