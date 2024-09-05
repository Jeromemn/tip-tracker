import React from "react";
import styled from "styled-components";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TextInput = styled.input`
  padding: 16px 18px;
  background: ${(props) => props.theme.colors.black};
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  color: ${(props) => props.theme.colors.white};

  &: placeholder {
    color: ${(props) => props.theme.colors.lightGray};
  }
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 18px;
  color: ${(props) => props.theme.colors.lightGray};
  letter-spacing: 1px;
`;

const Input = ({ label, type, placeholder, value, onChange }) => {
  return (
    <InputWrapper>
      <Label>{label}</Label>
      <TextInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </InputWrapper>
  );
};

export default Input;
