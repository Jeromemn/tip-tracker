import React from "react";
import styled from "styled-components";

const TotalsWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const TotalsBox = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  align-items: center;
  border-radius: 8px;
  padding: 8px;
`;

const TotalsHeading = ({ earnings, hours, tips, rate }) => {
  return (
    <TotalsWrapper>
      <TotalsBox>
        <h3> Earnings</h3>
        <h3>{earnings}</h3>
      </TotalsBox>
      <TotalsBox>
        <h3>Hours</h3>
        <h3>{hours}</h3>
      </TotalsBox>
      <TotalsBox>
        <h3>Tips</h3>
        <h3>{tips}</h3>
      </TotalsBox>
      <TotalsBox>
        <h3>Hourly</h3>
        <h3>{rate}</h3>
      </TotalsBox>
    </TotalsWrapper>
  );
};

export default TotalsHeading;
