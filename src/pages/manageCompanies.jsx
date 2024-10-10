import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Wrapper from "../components/Wrapper";
import Button from "../components/Button";
import { DeleteIcon } from "@/icons";

const ManageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const AllCompanies = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const CompanyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;

const CompanyHeader = styled.h2`
  text-transform: capitalize;
`;

const TableHeader = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 40% 30% 30%;
  border-bottom: 1px solid ${(props) => props.theme.colors.orange};
  padding: 8px 5px;
`;

const LocationWrapper = styled.div`
  display: grid;
  grid-template-columns: 40% 10% 30%;
  column-gap: 9%;
  width: 100%;
  padding: 10px 5px;
  border-bottom: 1px solid black;
  align-items: center;
`;

const Text = styled.p`
  font-size: 20px;
  font-weight: 600;
  text-transform: capitalize;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ManagerCompanies = () => {
  const [companies, setCompanies] = useState([]);
  console.log(companies);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("api/companies");
        const data = await response.json();
        setCompanies(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCompanies();
  }, []);
  return (
    <Wrapper>
      <ManageContainer>
        <h1>Manage Companies</h1>
        <AllCompanies>
          {companies.map((company) => (
            <CompanyWrapper key={company.name}>
              <CompanyHeader>{company.name}</CompanyHeader>
              <TableHeader>
                <h3>Location</h3>
                <h3>Pay Rate</h3>
              </TableHeader>
              {company.locations.map((location) => (
                <LocationWrapper key={location.locationName}>
                  <Text>{location.locationName}</Text>
                  <Text>${location.payRate}</Text>
                  <ButtonWrapper>
                    <Button variant="secondary"> Edit </Button>
                    <Button variant="icon">
                      <DeleteIcon />
                    </Button>
                  </ButtonWrapper>
                </LocationWrapper>
              ))}
            </CompanyWrapper>
          ))}
        </AllCompanies>
      </ManageContainer>
    </Wrapper>
  );
};

export default ManagerCompanies;
