import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TotalsHeading from "./TotalsHeading";

const EarningsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  gap: 16px;
`;

const CompanyWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
`;

const LocationWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const LocationDataWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid black;
  border-radius: 8px;
  padding: 8px;
`;

const DataBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const DataHeader = styled.h4``;

const CompanyHeader = styled.h4`
  text-transform: capitalize;
  font-size: 1.5rem;
`;

const LocationHeader = styled.h4`
  text-transform: capitalize;
  font-size: 1.25rem;
`;

const EarningsReport = () => {
  const [reportData, setReportData] = useState({
    totalEarnings: 0,
    totalHours: 0,
    totalTips: 0,
    hourlyRate: 0,
    earningsByCompany: {},
  });

  const [companyNames, setCompanyNames] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/shifts");
        const data = await response.json();
        generateEarningsReport(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load earings report");
      }
    };
    fetchData();
  }, []);

  const generateEarningsReport = (shifts) => {
    let totalEarnings = 0;
    let totalHours = 0;
    let totalTips = 0;
    let earningsByCompany = {};
    let companyNamesTemp = {};

    shifts.forEach((shift) => {
      const {
        companyId,
        companyName,
        locationName,
        totalPay,
        hoursWorked,
        tips,
      } = shift;
      totalEarnings += totalPay;
      totalHours += hoursWorked;
      totalTips += tips;

      // if companyID is not present initialize it
      if (!earningsByCompany[companyId]) {
        earningsByCompany[companyId] = {
          totalEarnings: 0,
          totalHoursWorked: 0,
          totalTips: 0,
          locations: {},
        };
        companyNamesTemp[companyId] = companyName;
      }
      // Update the company's earnings, hours worked, and tips
      earningsByCompany[companyId].totalEarnings += totalPay;
      earningsByCompany[companyId].totalHoursWorked += hoursWorked;
      earningsByCompany[companyId].totalTips += tips;

      // if location is not present initialize it
      if (!earningsByCompany[companyId].locations[locationName]) {
        earningsByCompany[companyId].locations[locationName] = {
          totalEarnings: 0,
          totalHoursWorked: 0,
          totalTips: 0,
          numberofShifts: 0,
          averageShiftEarnings: 0,
        };
      }

      // Update location's total earnings, hours, and tips
      earningsByCompany[companyId].locations[locationName].totalEarnings +=
        totalPay;
      earningsByCompany[companyId].locations[locationName].totalHoursWorked +=
        hoursWorked;
      earningsByCompany[companyId].locations[locationName].totalTips += tips;
      earningsByCompany[companyId].locations[locationName].numberofShifts++;
    });

    setCompanyNames(companyNamesTemp);

    setReportData({
      totalEarnings,
      totalHours,
      totalTips,
      hourlyRate: totalEarnings / totalHours,
      earningsByCompany,
    });
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <EarningsContainer>
      <TotalsHeading
        earnings={reportData?.totalEarnings.toFixed(2)}
        hours={reportData?.totalHours.toFixed(2)}
        tips={reportData?.totalTips.toFixed(2)}
        rate={reportData?.hourlyRate.toFixed(2)}
      />
      {Object.entries(reportData.earningsByCompany).map(
        ([companyId, companyData]) => (
          <CompanyWrapper key={companyId}>
            <CompanyHeader> {companyNames[companyId]}</CompanyHeader>
            {Object.entries(companyData.locations).map(
              ([locationName, locationData]) => (
                <LocationWrapper key={locationName}>
                  <LocationHeader> {locationName}</LocationHeader>
                  <LocationDataWrapper>
                    <DataBox>
                      <DataHeader>Earnings</DataHeader>
                      <p>${locationData.totalEarnings.toFixed(2)}</p>
                    </DataBox>
                    <DataBox>
                      <DataHeader>Hours</DataHeader>
                      <p>{locationData.totalHoursWorked.toFixed(2)}</p>
                    </DataBox>
                    <DataBox>
                      <DataHeader>Tips</DataHeader>
                      <p>${locationData.totalTips.toFixed(2)}</p>
                    </DataBox>
                    <DataBox>
                      <DataHeader>Hourly</DataHeader>
                      <p>
                        $
                        {(
                          locationData.totalEarnings /
                          locationData.totalHoursWorked
                        ).toFixed(2)}
                      </p>
                    </DataBox>
                    <DataBox>
                      <DataHeader>Avg Shift</DataHeader>
                      <p>
                        $
                        {(
                          locationData.totalEarnings /
                          locationData.numberofShifts
                        ).toFixed(2)}
                      </p>
                    </DataBox>
                  </LocationDataWrapper>
                </LocationWrapper>
              )
            )}
          </CompanyWrapper>
        )
      )}
    </EarningsContainer>
  );
};

export default EarningsReport;
