import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "./Input";
import Button from "./Button";
import Dropdown from "./Dropdown";
import { useSession } from "next-auth/react";

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 24px;
`;

const AddLocation = () => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    company: "",
    location: "",
    payRate: 0,
  });
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  // selected company is an object with id and name properties

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/companies");
      const data = await response.json();
      setCompanies(data);
    };
    fetchData();
  }, []);

  const handleCompanyChange = (companyId) => {
    const company = companies.find((company) => company._id === companyId);
    setSelectedCompany({
      id: company._id,
      name: company.name,
    });
    setFormData((prevData) => ({
      ...prevData,
      company: company.name,
    }));
  };

  const handleLocationInputChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      location: value,
    });
  };

  const handlePayRateInputChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      payRate: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!session) {
      alert("You must be signed in to add a location.");
      return;
    }

    const cleanedFormData = {
      company: selectedCompany,
      location: formData.location,
      payRate: Number(formData.payRate),
      userId: session.user.id,
      // Ensure payRate is a number
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
        console.log("Location added successfully:", result.message);
        document.getElementById("SubmitForm").reset();
        setSelectedCompany("");
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error creating location:", error);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit} id="SubmitForm">
      <Dropdown
        options={companies}
        onChange={handleCompanyChange}
        value={selectedCompany.id}
        labelKey="name"
        valueKey="_id"
      ></Dropdown>
      <Input
        label="Location Name"
        type="text"
        placeholder="Enter location name"
        value={formData.location || ""}
        name="locationName"
        onChange={(event) => handleLocationInputChange(event)}
      />
      <Input
        label="Pay Rate"
        type="number"
        placeholder="Enter pay rate"
        value={formData.payRate}
        name="payRate"
        onChange={(event) => handlePayRateInputChange(event)}
      />
      <Button type="submit">Submit</Button>
    </FormWrapper>
  );
};

export default AddLocation;
