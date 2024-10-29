import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Wrapper from "../components/Wrapper";
import ShiftView from "@/components/modals/ShiftView";
import { useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();

  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState("");
  const [showShift, setShowShift] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchShifts = async () => {
        try {
          const res = await fetch("/api/shifts");
          if (!res.ok) {
            throw new Error("Failed to fetch shifts");
          }
          const data = await res.json();
          setShifts(data);
        } catch (error) {
          console.error("Error fetching shifts:", error);
        }
      };

      fetchShifts();
    } else if (status === "unauthenticated") {
      signIn(); // Redirect to sign-in page if unauthenticated
    }
  }, [status]);

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString); // Create the date object

    // Use the user's local timezone to extract year, month, and day.
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    };
    return date.toLocaleDateString(undefined, options); // e.g., "October 18, 2024"
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
    handleClose();
  };

  const handleUpdateShift = (updatedShift) => {
    // Update the shifts list by replacing the updated shift
    setShifts((prevShifts) =>
      prevShifts.map((shift) =>
        shift._id === updatedShift.shiftId
          ? {
              ...shift,
              locationName: updatedShift.formattedShiftData.locationName,
              tips: updatedShift.formattedShiftData.tips,
              totalPay: updatedShift.formattedShiftData.totalPay,
            }
          : shift
      )
    );
    handleClose();
  };

  return (
    <Wrapper>
      {selectedShift && (
        <ShiftView
          onClose={handleClose}
          selectedShift={selectedShift}
          showShift={showShift}
          onDelete={handleDeleteShift}
          onUpdate={handleUpdateShift}
          user={session?.user}
        />
      )}
      <ShiftsContainer>
        <h1>Shifts</h1>
        {shifts.map((shift) => (
          <ShiftWrapper key={shift._id} onClick={() => handleOpenShift(shift)}>
            <ShiftDetails>
              <h2>{shift.locationName}</h2>
              <h2> {formatDateForDisplay(shift.date)}</h2>
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
