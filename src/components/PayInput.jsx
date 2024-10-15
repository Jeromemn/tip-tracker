import React, { useState, useEffect } from "react";
import styled from "styled-components";

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid black;
  border-radius: 4px;
  width: 65px;
  gap: 4px;
  padding: 0 4px;
`;

const StyledInput = styled.input`
  height: 100%;
  border: none;
  outline: none;
  width: 40px;
`;

const Text = styled.p`
  font-size: 20px;
  font-weight: 600;
`;

const PayInput = ({ name, value, onChange, ...rest }) => {
  return (
    <InputWrapper>
      <Text>$</Text>
      <StyledInput
        type="number"
        placeholder="0.00"
        name={name}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </InputWrapper>
  );
};

export default PayInput;
