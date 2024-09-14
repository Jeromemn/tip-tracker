import React, { useState } from "react";
import styled from "styled-components";
import { DownArrow, UpArrow } from "@/icons";

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
`;

const Select = styled.div`
  display: flex;
  border: 1px solid #ccc;
  padding: 8px;
`;

const OptionsWrapper = styled.div`
  display: flex;
  border: ${(props) => (props.$isOpen ? "1px solid #ccc" : "none")};
  flex-direction: column;
  max-height: ${(props) => (props.$isOpen ? "100px" : "0")};
  transition: max-height 0.3s ease-in-out;
  overflow: ${(props) => (props.$isOpen ? "auto" : "hidden")};
`;

const Option = styled.div`
  padding: 8px;
  cursor: pointer;
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  transition: visibility 0.01s 0.2s, opacity 0.2s;
`;

const Dropdown = ({ label, value, options, onChange, labelKey, valueKey }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    onChange(option[valueKey]);
    setIsOpen(false);
  };

  return (
    <DropdownWrapper>
      <Label>{label}</Label>
      <Select value={value} onClick={handleOpen}>
        {value
          ? options.find((option) => option[valueKey] === value)?.[labelKey]
          : "Select an option"}
        {!isOpen ? <DownArrow /> : <UpArrow />}
      </Select>
      <OptionsWrapper $isOpen={isOpen}>
        {options.map((option) => (
          <Option
            key={option[valueKey]}
            onClick={() => handleSelect(option)}
            $isOpen={isOpen}
          >
            {option[labelKey]}
          </Option>
        ))}
      </OptionsWrapper>
    </DropdownWrapper>
  );
};

export default Dropdown;
