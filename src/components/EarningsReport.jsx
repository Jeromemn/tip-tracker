import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div``;

const Section = styled.section`
  margin-bottom: 24px;
`;

const EarningsReport = () => {
  const [reportData, setReportData] = useState({
    totalEarnings: 0,
    totalHours: 0,
    totalTips: 0,
    hourlyRate: 0,
    earningsByCompany: [],
    earningsByLocation: [],
  });

  const [companyNames, setCompanyNames] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/shifts");
        const data = await response.json();
        generateEaningsReport(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const generateEaningsReport = (shifts) => {
    let totalEarnings = 0;
    let totalHours = 0;
    let totalTips = 0;
    let earningsByCompany = [];
    let earningsByLocation = [];
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

      if (!earningsByCompany[companyId]) {
        earningsByCompany[companyId] = 0;
        companyNamesTemp[companyId] = companyName;
      }
      earningsByCompany[companyId] += totalPay;

      if (!earningsByLocation[locationName]) {
        earningsByLocation[locationName] = 0;
      }
      earningsByLocation[locationName] += totalPay;
    });

    setCompanyNames(companyNamesTemp);

    setReportData({
      totalEarnings,
      totalHours,
      totalTips,
      hourlyRate: totalEarnings / totalHours,
      earningsByCompany,
      earningsByLocation,
    });
  };

  return (
    <Wrapper>
      <h1> Earnings Report</h1>
      <Section>
        <h2>total earnings: ${reportData?.totalEarnings.toFixed(2)}</h2>
      </Section>
      <Section>
        <h2>earnings by company:</h2>
        <ul>
          {Object.entries(reportData.earningsByCompany).map(
            ([companyId, earnings]) => (
              <li key={companyId}>
                Company {companyNames[companyId]}: ${earnings.toFixed(2)}
              </li>
            )
          )}
        </ul>
      </Section>
      <Section>
        <h2>earnings by location:</h2>
        <ul>
          {Object.entries(reportData.earningsByLocation).map(
            ([location, earnings]) => (
              <li key={location}>
                Location {location}: ${earnings.toFixed(2)}
              </li>
            )
          )}
        </ul>
      </Section>
    </Wrapper>
  );
};

export default EarningsReport;
