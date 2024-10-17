import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Wrapper from "../components/Wrapper";
import Button from "../components/Button";
import { DeleteIcon } from "@/icons";
import DeleteModal from "../components/modals/DeleteModal";
import EditLocation from "@/components/modals/EditLocation";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const [companies, setCompanies] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [locationId, setLocationId] = useState("");
  console.log(selectedItem);
  const [selectedPayRate, setSelectedPayRate] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("api/companies");
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCompanies();
  }, []);

  const handleDelete = (location) => {
    setDeleteOpen(true);
    setSelectedItem(location.location);
    setSelectedCompanyId(location.companyId);
    setLocationId(location.locationId);
  };

  console.log("company id", selectedCompanyId);
  console.log("location id", locationId);
  console.log("user id ", session?.user.id);

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch("/api/locations/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: selectedCompanyId,
          locationId: locationId,
          user_id: session.user.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the companies array to remove the deleted location immutably
        const updatedCompanies = companies.map((company) =>
          company._id === selectedCompanyId
            ? {
                ...company,
                locations: company.locations.filter(
                  (location) => location.locationName !== selectedItem
                ),
              }
            : company
        );
        setCompanies(updatedCompanies);
        handleCloseModal();
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOpenEdit = (location) => {
    setEditOpen(true);
    setSelectedItem(location.location);
    setSelectedCompanyId(location.companyId);
    setSelectedPayRate(location.payRate);
    setLocationId(location.locationId);
  };

  console.log(locationId);

  const handleConfirmUpdate = async (updatedData) => {
    try {
      const { location, payRate } = updatedData;
      const response = await fetch("/api/locations/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: selectedCompanyId,
          oldLocation: selectedItem,
          newLocation: location,
          payRate: payRate,
          userId: session.user.id,
          locationId: locationId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the companies array with the updated location and pay rate
        const updatedCompanies = companies.map((company) =>
          company._id === selectedCompanyId
            ? {
                ...company,
                locations: company.locations.map(
                  (loc) =>
                    loc.locationName === selectedItem
                      ? { ...loc, locationName: location, payRate: payRate } // Update location name and pay rate
                      : loc // Keep the rest unchanged
                ),
              }
            : company
        );
        setCompanies(updatedCompanies);

        handleCloseEdit();
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedItem("");
    setSelectedCompanyId("");
    setSelectedPayRate("");
  };

  const handleCloseModal = () => {
    setDeleteOpen(false);
    setSelectedItem("");
    setSelectedCompanyId("");
  };

  return (
    <Wrapper>
      <DeleteModal
        selectedItem={selectedItem}
        showModal={deleteOpen}
        onClose={handleCloseModal}
        onConfirmDelete={handleConfirmDelete}
      />
      <EditLocation
        selectedItem={selectedItem}
        showModal={editOpen}
        onClose={handleCloseEdit}
        payRate={selectedPayRate}
        onConfirmUpdate={handleConfirmUpdate}
      />
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
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleOpenEdit({
                          location: location.locationName,
                          locationId: location.locationId,
                          payRate: location.payRate,
                          companyId: company._id,
                        })
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="icon"
                      onClick={() =>
                        handleDelete({
                          location: location.locationName,
                          locationId: location.locationId,
                          company: company.name,
                          companyId: company._id,
                        })
                      }
                    >
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
