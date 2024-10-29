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

const Text = styled.p`
  font-size: 20px;
  font-weight: 600;
`;

const AddShift = () => {
  const { data: session, status } = useSession();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [payRate, setPayRate] = useState(0);
  const [formData, setFormData] = useState({
    companyId: "",
    locationId: "",
    date: "",
    clockIn: "",
    clockOut: "",
    tips: null,
    hoursWorked: 0,
    totalBasePay: 0,
    totalHourlyRate: 0,
    totalPay: 0,
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/companies/");
          if (!response.ok) {
            throw new Error("Failed to fetch companies.");
          }
          const data = await response.json();
          setCompanies(data);
        } catch (error) {
          console.error("Error fetching companies:", error);
          // setError(error.message);
        }
      } else if (status === "unauthenticated") {
        signIn(); // Redirect to sign-in if not authenticated
      }
    };

    fetchCompanies();
  }, [status]);

  // Handle company selection
  const handleCompanyChange = (companyId) => {
    const company = companies.find((company) => company._id === companyId);
    setSelectedCompany(company);
    setSelectedLocation(""); // Reset location when company changes
    setPayRate(0); // Reset pay rate when company changes
  };

  // Handle location selection
  const handleLocationChange = (locationId) => {
    const location = selectedCompany.locations.find(
      (loc) => loc.locationId === locationId
    );
    setSelectedLocation(location);
    setPayRate(location.payRate);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Calculate total hours worked
  // Calculate hours worked and pay when clockIn or clockOut changes
  useEffect(() => {
    if (formData.clockIn && formData.clockOut) {
      const clockInTime = new Date(`1970-01-01T${formData.clockIn}:00`);
      const clockOutTime = new Date(`1970-01-01T${formData.clockOut}:00`);

      // Handle overnight shifts
      if (clockOutTime < clockInTime) {
        clockOutTime.setDate(clockOutTime.getDate() + 1);
      }

      const hoursWorked = (clockOutTime - clockInTime) / (1000 * 60 * 60); // Convert ms to hours
      const totalBasePay = hoursWorked * payRate;
      const totalPay = totalBasePay + parseFloat(formData.tips || 0);
      const totalHourlyRate = totalPay / hoursWorked;

      setFormData((prev) => ({
        ...prev,
        hoursWorked: hoursWorked.toFixed(2),
        totalBasePay: totalBasePay.toFixed(2),
        totalPay: totalPay.toFixed(2),
        totalHourlyRate: totalHourlyRate.toFixed(2),
      }));
    }
  }, [formData.clockIn, formData.clockOut, payRate, formData.tips]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const shiftData = {
      user_id: session.user.id,
      companyId: selectedCompany._id,
      companyName: selectedCompany.name,
      locationId: selectedLocation.locationId,
      locationName: selectedLocation.locationName,
      date: formData.date,
      clockIn: formData.clockIn,
      clockOut: formData.clockOut,
      hoursWorked: formData.hoursWorked,
      payRate,
      totalBasePay: formData.totalBasePay,
      totalHourlyRate: formData.totalHourlyRate,
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
      resetForm();
    } catch (error) {
      console.error("Error adding shift:", error);
    }
  };

  const resetForm = () => {
    setSelectedCompany("");
    setSelectedLocation("");
    setPayRate(0);
    setFormData({
      date: "",
      clockIn: "",
      clockOut: "",
      tips: null,
      hoursWorked: 0,
      totalBasePay: 0,
      totalPay: 0,
    });
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      {/* Company Selection */}

      <Dropdown
        options={companies}
        onChange={handleCompanyChange}
        value={selectedCompany._id || ""}
        labelKey="name"
        valueKey="_id"
      ></Dropdown>
      <Dropdown
        options={selectedCompany?.locations || []}
        onChange={handleLocationChange}
        value={selectedLocation.locationId || ""}
        labelKey="locationName"
        valueKey="locationId"
      ></Dropdown>

      {/* Clock In/Clock Out Times */}
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleInputChange}
      ></input>

      <div>
        <Text>Time In:</Text>
        <input
          type="time"
          name="clockIn"
          value={formData.clockIn}
          onChange={handleInputChange}
        ></input>
      </div>
      <div>
        <Text>Time Out:</Text>
        <input
          type="time"
          name="clockOut"
          value={formData.clockOut}
          onChange={handleInputChange}
        ></input>
      </div>

      {/* Tips Earned */}
      <Input
        label="Tips Earned"
        type="number"
        name="tips"
        value={formData.tips || null}
        onChange={handleInputChange}
      />

      {/* Display Calculations */}
      {formData.hoursWorked > 0 && (
        <div>
          <p>Hours Worked: {formData.hoursWorked}</p>
          <p>Total Base Pay: ${formData.totalBasePay}</p>
          <p>Total Hourly Rate: ${formData.totalHourlyRate}</p>
          <p>Total Pay: ${formData.totalPay}</p>
        </div>
      )}

      {/* Submit Shift Button */}
      <Button type="submit">Submit Shift</Button>
    </FormWrapper>
  );
};

export default AddShift;
