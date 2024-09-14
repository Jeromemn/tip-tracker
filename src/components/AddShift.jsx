import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "./Input";
import Button from "./Button";
import Dropdown from "./Dropdown";

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 24px;
`;

const AddShift = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [payRate, setPayRate] = useState(0);
  const [formData, setFormData] = useState({
    clockIn: "",
    clockOut: "",
    tips: 0,
    hoursWorked: 0,
    totalHourlyPay: 0,
    totalPay: 0,
  });

  // Fetch companies and locations from the database
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/companies");
      const data = await response.json();
      setCompanies(data);
    };
    fetchData();
  }, []);

  // Handle company selection
  const handleCompanyChange = (companyId) => {
    const company = companies.find((company) => company._id === companyId);
    setSelectedCompany({
      id: company._id,
      name: company.name,
    });
    setSelectedLocation(""); // Reset location when company changes
    setPayRate(0); // Reset pay rate when company changes
  };

  // Handle location selection
  const handleLocationChange = (locationName) => {
    const selectedCompanyData = companies.find(
      (company) => company._id === selectedCompany.id
    );
    const selectedLocationData = selectedCompanyData.locations.find(
      (location) => location.locationName === locationName
    );
    setSelectedLocation(locationName);
    setPayRate(selectedLocationData.payRate); // Set pay rate for selected location
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Calculate total hours worked
  useEffect(() => {
    if (formData.clockIn && formData.clockOut) {
      const clockInTime = new Date(formData.clockIn);
      const clockOutTime = new Date(formData.clockOut);

      const hoursWorked = (clockOutTime - clockInTime) / (1000 * 60 * 60); // Convert milliseconds to hours

      setFormData((prevData) => ({
        ...prevData,
        hoursWorked: hoursWorked.toFixed(2),
      }));
    }
  }, [formData.clockIn, formData.clockOut]);

  // Calculate total hourly pay and total pay
  useEffect(() => {
    const totalHourlyPay = formData.hoursWorked * payRate;
    const totalPay = totalHourlyPay + Number(formData.tips);

    setFormData((prevData) => ({
      ...prevData,
      totalHourlyPay: totalHourlyPay.toFixed(2),
      totalPay: totalPay.toFixed(2),
    }));
  }, [formData.hoursWorked, payRate, formData.tips]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const shiftData = {
      companyId: selectedCompany,
      companyName: selectedCompany.name,
      locationName: selectedLocation,
      clockIn: formData.clockIn,
      clockOut: formData.clockOut,
      hoursWorked: formData.hoursWorked,
      payRate,
      totalHourlyPay: formData.totalHourlyPay,
      totalPay: formData.totalPay,
      tips: formData.tips,
    };

    try {
      const response = await fetch("/api/shifts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shiftData),
      });
      const result = await response.json();
      console.log("Shift added:", result);
      setSelectedCompany("");
      setSelectedLocation("");
      setPayRate(0);
      setFormData({
        clockIn: "",
        clockOut: "",
        tips: 0,
        hoursWorked: 0,
        totalHourlyPay: 0,
        totalPay: 0,
      });
    } catch (error) {
      console.error("Error adding shift:", error);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      {/* Company Selection */}

      <Dropdown
        options={companies}
        onChange={handleCompanyChange}
        value={selectedCompany.id}
        labelKey="name"
        valueKey="_id"
      ></Dropdown>
      <Dropdown
        options={
          companies.find((company) => company._id === selectedCompany.id)
            ?.locations || []
        }
        onChange={handleLocationChange}
        value={selectedLocation}
        labelKey="locationName"
        valueKey="locationName"
      ></Dropdown>

      {/* Clock In/Clock Out Times */}
      <Input
        label="Clock In"
        type="datetime-local"
        name="clockIn"
        value={formData.clockIn}
        onChange={handleInputChange}
      />
      <Input
        label="Clock Out"
        type="datetime-local"
        name="clockOut"
        value={formData.clockOut}
        onChange={handleInputChange}
      />

      {/* Tips Earned */}
      <Input
        label="Tips Earned"
        type="number"
        name="tips"
        value={formData.tips}
        onChange={handleInputChange}
      />

      {/* Display Calculations */}
      {formData.hoursWorked > 0 && (
        <div>
          <p>Hours Worked: {formData.hoursWorked}</p>
          <p>Total Base Pay: ${formData.totalHourlyPay}</p>
          <p>Total Pay: ${formData.totalPay}</p>
        </div>
      )}

      {/* Submit Shift Button */}
      <Button type="submit">Submit Shift</Button>
    </FormWrapper>
  );
};

export default AddShift;
