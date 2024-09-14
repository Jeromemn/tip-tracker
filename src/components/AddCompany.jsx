import React, { useState } from "react";
import styled from "styled-components";
import Input from "./Input";
import Button from "./Button";

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 24px;
`;

const AddCompany = () => {
  const [formData, setFormData] = useState({
    company: "",
    locations: [
      {
        locationName: "",
        payRate: 0,
      },
    ],
  });

  // Handle input changes for company name
  const handleCompanyInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle input changes for specific location fields
  const handleLocationInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedLocations = [...formData.locations];
    updatedLocations[index][name] = value;
    setFormData({
      ...formData,
      locations: updatedLocations,
    });
  };

  // Add a new location
  const addLocation = () => {
    setFormData({
      ...formData,
      locations: [...formData.locations, { locationName: "", payRate: 0 }],
    });
  };

  // Submit form data
  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanedFormData = {
      ...formData,
      locations: formData.locations.map((location) => ({
        ...location,
        payRate: Number(location.payRate), // Ensure payRate is a number
      })),
    };

    try {
      const response = await fetch("/api/companies/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedFormData),
      });

      const result = await response.json();
      console.log("Company created with ID:", result.companyId);
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <Input
        label="Company Name"
        type="text"
        placeholder="Enter the company name"
        name="company"
        value={formData.company}
        onChange={handleCompanyInputChange}
      />

      {/* Dynamically handle locations */}
      {formData.locations.map((location, index) => (
        <div key={index}>
          <Input
            label="Location Name"
            type="text"
            placeholder="Enter the location name"
            name="locationName"
            value={location.locationName}
            onChange={(e) => handleLocationInputChange(e, index)}
          />
          <Input
            label="Pay Rate"
            type="number"
            placeholder="Enter the pay rate"
            name="payRate"
            value={location.payRate}
            onChange={(e) => handleLocationInputChange(e, index)}
          />
        </div>
      ))}

      <Button type="button" onClick={addLocation}>
        Add Another Location
      </Button>
      <Button type="submit">Submit</Button>
    </FormWrapper>
  );
};

export default AddCompany;
