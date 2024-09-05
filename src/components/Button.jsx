import React from "react";
import styled from "styled-components";

const PrimaryButton = styled.button`
  background: ${(props) => props.theme.colors.orange};
  color: ${(props) => props.theme.colors.white};
  padding: 16px 24px;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Button = ({ children, ...rest }) => {
  return <PrimaryButton {...rest}>{children}</PrimaryButton>;
};

export default Button;
