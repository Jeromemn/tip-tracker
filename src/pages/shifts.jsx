import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Wrapper from "../components/Wrapper";
import ShiftView from "@/components/modals/ShiftView";

const ShiftsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  align-items: center;
`;

const ShiftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 16px 0;
  border-bottom: 1px solid #e0e0e0;
  gap: 8px;
`;

const IncomeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ShiftDetails = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Shifts = () => {
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState("");
  const [showShift, setShowShift] = useState(false);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await fetch("/api/shifts");
        const data = await res.json();
        setShifts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchShifts();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleOpenShift = (shift) => {
    setSelectedShift(shift);
    setShowShift(true);
  };

  const handleClose = () => {
    setShowShift(false);
    setSelectedShift("");
  };

  const handleDeleteShift = (deletedShiftId) => {
    // Update the shifts list by removing the deleted shift
    setShifts((prevShifts) =>
      prevShifts.filter((shift) => shift._id !== deletedShiftId)
    );
  };

  return (
    <Wrapper>
      <ShiftView
        onClose={handleClose}
        selectedShift={selectedShift}
        showShift={showShift}
        onDelete={handleDeleteShift}
      />
      <ShiftsContainer>
        <h1>Shifts</h1>
        {shifts.map((shift) => (
          <ShiftWrapper key={shift._id} onClick={() => handleOpenShift(shift)}>
            <ShiftDetails>
              <h2>{shift.locationName}</h2>
              <h2> {formatDate(shift.clockIn)}</h2>
            </ShiftDetails>
            <IncomeWrapper>
              <h2>Tips: ${shift.tips}</h2>
              <h2>Total: ${shift.totalPay}</h2>
            </IncomeWrapper>
          </ShiftWrapper>
        ))}
      </ShiftsContainer>
    </Wrapper>
  );
};

export default Shifts;
