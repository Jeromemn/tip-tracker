import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import Wrapper from "../Wrapper";
import Button from "../Button";
import PayInput from "../PayInput";
import Close from "@/icons/Close";
import DeleteModal from "./DeleteModal";
import { formatTimeForInput, formatDateForDisplay } from "@/Utils/helpers";

const ContentContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 16px 16px;
  gap: 16px;
  border-radius: 4px;
  position: relative;
`;

const LocationSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  width: 100%;
`;

const TimeSection = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
`;

const BasePaySection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 16px;
`;

const TotalPaySection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

const TipsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Text = styled.p`
  font-size: 20px;
  font-weight: 600;
`;

const PayRateWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  border: none;
  background-color: transparent;
  outline: none;
`;

const ShiftView = ({
  onClose,
  selectedShift,
  showShift,
  onDelete,
  onUpdate,
  user,
}) => {
  const [editShift, setEditShift] = useState(false);
  const [deleteShift, setDeleteShift] = useState(false);
  const [shiftId, setShiftId] = useState("");

  const [shiftData, setShiftData] = useState({
    clockIn: formatTimeForInput(selectedShift.clockIn) || "",
    clockOut: formatTimeForInput(selectedShift.clockOut) || "",
  });

  useEffect(() => {
    // Ensure the shiftData reflects the selectedShift when the component mounts
    setShiftData({
      ...selectedShift,
      date: formatDateForDisplay(selectedShift.date),
      clockIn: formatTimeForInput(selectedShift.clockIn) || "",
      clockOut: formatTimeForInput(selectedShift.clockOut) || "",
    });
  }, [selectedShift]);

  const calculateHoursAndPay = () => {
    const [inHours, inMinutes] = shiftData?.clockIn.split(":").map(Number);
    const [outHours, outMinutes] = shiftData?.clockOut.split(":").map(Number);

    let clockInDate = new Date(1970, 0, 1, inHours, inMinutes);
    let clockOutDate = new Date(1970, 0, 1, outHours, outMinutes);

    if (clockOutDate <= clockInDate) {
      clockOutDate.setDate(clockOutDate.getDate() + 1);
    }

    const hoursWorked = (clockOutDate - clockInDate) / (1000 * 60 * 60);
    const totalBasePay = hoursWorked * shiftData.payRate;
    const totalPay = totalBasePay + parseFloat(shiftData.tips);

    return {
      hoursWorked: hoursWorked.toFixed(2),
      totalBasePay: totalBasePay.toFixed(2),
      totalPay: totalPay.toFixed(2),
    };
  };

  useEffect(() => {
    const { hoursWorked, totalBasePay, totalPay } = calculateHoursAndPay();
    setShiftData((prevData) => ({
      ...prevData,
      hoursWorked,
      totalBasePay,
      totalPay,
    }));
  }, [
    shiftData.clockIn,
    shiftData.clockOut,
    shiftData.payRate,
    shiftData.tips,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShiftData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setEditShift(false);
    onClose();
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch("/api/shifts/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shiftId, user_id: user.id }),
      });

      const data = await response.json();
      if (response.ok) {
        onDelete(shiftId);
        setDeleteShift(false);
        onClose();
        console.log("Shift deleted successfully:", data);
        // Update the UI by removing the shift from the list
      } else {
        console.error("Error deleting shift:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = () => {
    setDeleteShift(true);
    setShiftId(selectedShift._id);
  };

  const handleCloseDelete = () => {
    setDeleteShift(false);
  };

  const handleUpdate = async () => {
    try {
      const { _id, ...updatedShiftData } = shiftData;

      const formattedShiftData = {
        ...updatedShiftData,
        locationName: selectedShift.locationName,
        date: new Date(shiftData.date),
        clockIn: `1970-01-01T${shiftData.clockIn}:00`, // Convert time to ISO format
        clockOut: `1970-01-01T${shiftData.clockOut}:00`, // Same for clock out
        hoursWorked: parseFloat(shiftData.hoursWorked), // Ensure hoursWorked is a number
        payRate: parseFloat(shiftData.payRate),
        totalBasePay: parseFloat(shiftData.totalBasePay),
        tips: parseFloat(shiftData.tips),
        totalHourlyRate: parseFloat(shiftData.totalHourlyRate),
        totalPay: parseFloat(shiftData.totalPay),
      };

      const response = await fetch("/api/shifts/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shiftId: _id,
          user_id: user.id,
          ...formattedShiftData,
        }),
      });

      if (response.ok) {
        const updatedShift = await response.json();
        onUpdate({ formattedShiftData, shiftId: selectedShift._id });
      } else {
        console.error("Error updating shift:", await response.json());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal $isopen={showShift}>
      <Wrapper>
        {deleteShift ? (
          <DeleteModal
            selectedItem="Shift"
            showModal={deleteShift}
            onClose={handleCloseDelete}
            onConfirmDelete={handleConfirmDelete}
          />
        ) : (
          <ContentContainer>
            <CloseButton type="button" onClick={handleClose}>
              <Close color="black" />
            </CloseButton>
            <h2> {shiftData?.date} </h2>
            <LocationSection>
              <Text>Location:</Text>
              <Text>{selectedShift.locationName}</Text>
            </LocationSection>
            <TimeSection>
              <div>
                <Text>Time In:</Text>
                <input
                  type="time"
                  name="clockIn"
                  readOnly={!editShift}
                  value={shiftData.clockIn || ""}
                  onChange={handleInputChange}
                ></input>
              </div>
              <div>
                <Text>Time Out:</Text>
                <input
                  type="time"
                  name="clockOut"
                  readOnly={!editShift}
                  value={shiftData.clockOut || ""}
                  onChange={handleInputChange}
                ></input>
              </div>
            </TimeSection>
            <BasePaySection>
              <Text>Hours: {shiftData.hoursWorked}</Text>

              <PayRateWrapper>
                <Text> PayRate: </Text>
                <PayInput
                  type="number"
                  name="payRate"
                  readOnly={!editShift}
                  value={shiftData.payRate || 0}
                  onChange={handleInputChange}
                ></PayInput>
              </PayRateWrapper>
              <Text> Total Base Pay: ${shiftData.totalBasePay} </Text>
            </BasePaySection>
            <TotalPaySection>
              <TipsContainer>
                <Text> Tips: </Text>
                <PayInput
                  type="number"
                  name="tips"
                  value={shiftData.tips || 0}
                  readOnly={!editShift}
                  onChange={handleInputChange}
                ></PayInput>
              </TipsContainer>
              <Text>
                Combined Hourly: $
                {(shiftData.totalPay / shiftData.hoursWorked).toFixed(2)}
              </Text>
              <Text> Combined Total: ${shiftData.totalPay} </Text>
            </TotalPaySection>
            {editShift ? (
              <ButtonContainer>
                <Button type="button" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleUpdate}>
                  Save
                </Button>
              </ButtonContainer>
            ) : (
              <ButtonContainer>
                <Button variant="warning" type="button" onClick={handleDelete}>
                  Delete
                </Button>
                <Button type="button" onClick={() => setEditShift(true)}>
                  Edit
                </Button>
              </ButtonContainer>
            )}
          </ContentContainer>
        )}
      </Wrapper>
    </Modal>
  );
};

export default ShiftView;
