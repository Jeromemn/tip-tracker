import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Wrapper from "../components/Wrapper";
import Button from "../components/Button";
import { DeleteIcon, Plus } from "@/icons";
import DeleteModal from "../components/modals/DeleteModal";
import EditLocation from "@/components/modals/EditLocation";
import AddLocationModal from "@/components/modals/AddLocationModal";
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
  const [addOpen, setAddOpen] = useState({
    showModal: false,
    company: "",
  });
  const [selectedItem, setSelectedItem] = useState({
    location: "",
    locationId: "",
    companyId: "",
    payRate: "",
  });

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
    setSelectedItem({
      location: location.locationName,
      locationId: location.locationId,
      companyId: location.companyId,
      payRate: location.payRate,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      const { companyId, locationId } = selectedItem;

      const response = await fetch("/api/locations/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId,
          locationId,
          user_id: session.user.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the companies array to remove the deleted location immutably
        const updatedCompanies = companies.map((company) =>
          company._id === companyId
            ? {
                ...company,
                locations: company.locations.filter(
                  (location) => location.locationId !== locationId
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
    setSelectedItem({
      location: location.locationName,
      locationId: location.locationId,
      companyId: location.companyId,
      payRate: location.payRate,
    });
  };

  const handleConfirmUpdate = async (updatedData) => {
    try {
      const { location: updatedLocation, payRate } = updatedData;
      const { companyId, locationId, location } = selectedItem;

      const updatedLocationData = {
        companyId,
        oldLocation: location,
        newLocation: updatedLocation,
        payRate,
        userId: session.user.id,
        locationId,
      };

      const response = await fetch("/api/locations/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLocationData),
      });

      if (response.ok) {
        // Update the companies array with the updated location and pay rate
        const updatedCompanies = companies.map((company) =>
          company._id === companyId
            ? {
                ...company,
                locations: company.locations.map(
                  (loc) =>
                    loc.locationId === locationId
                      ? { ...loc, locationName: updatedData.location, payRate }
                      : loc // Keep unchanged locations intact
                ),
              }
            : company
        );

        setCompanies(updatedCompanies);
        handleCloseEdit();
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedItem("");
  };

  const handleCloseModal = () => {
    setDeleteOpen(false);
    setSelectedItem("");
  };

  const handleAddLocation = (company) => {
    setAddOpen({
      showModal: true,
      company: company,
    });
  };

  const handleCloseAddLocation = () => {
    setAddOpen({ showModal: false, company: "" });
  };

  const handleLocationAdded = (result, companyId) => {
    const updatedCompanies = companies.map((company) =>
      company._id === companyId
        ? { ...company, locations: result.result.locations }
        : company
    );
    setCompanies(updatedCompanies);
    handleCloseAddLocation();
  };

  return (
    <Wrapper>
      <DeleteModal
        selectedItem={selectedItem.location}
        showModal={deleteOpen}
        onClose={handleCloseModal}
        onConfirmDelete={handleConfirmDelete}
      />
      <EditLocation
        selectedItem={selectedItem}
        showModal={editOpen}
        onClose={handleCloseEdit}
        onConfirmUpdate={handleConfirmUpdate}
      />
      <AddLocationModal
        showModal={addOpen.showModal}
        onClose={handleCloseAddLocation}
        company={addOpen.company}
        onLocationAdded={(result, companyId) =>
          handleLocationAdded(result, companyId)
        }
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
                <Button
                  variant="icon"
                  onClick={() => handleAddLocation(company)}
                >
                  Location
                  <Plus />
                </Button>
              </TableHeader>
              {company.locations.map((location) => (
                <LocationWrapper key={location.locationName}>
                  <Text>{location.locationName}</Text>
                  <Text>${location.payRate}</Text>
                  <ButtonWrapper>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleOpenEdit({ ...location, companyId: company._id })
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="icon"
                      onClick={() =>
                        handleDelete({
                          ...location,
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
