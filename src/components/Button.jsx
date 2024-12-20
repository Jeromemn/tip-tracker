import React from "react";
import styled from "styled-components";

const PrimaryButton = styled.button`
  background: ${(props) => props.theme.colors.lightGray};
  color: ${(props) => props.theme.colors.white};
  padding: 16px 24px;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

const SecondaryButton = styled.button`
  background: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.orange};
  padding: 12px 12px;
  border-radius: 4px;
  border: none;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const WarningButton = styled.button`
  background: red;
  color: white;
  padding: 12px 12px;
  border-radius: 4px;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const variants = {
  primary: PrimaryButton,
  secondary: SecondaryButton,
  icon: IconButton,
  warning: WarningButton,
};

const Button = ({
  variant = "primary",
  disabled = false,
  children,
  ...rest
}) => {
  const ButtonComponent = variants[variant] || PrimaryButton;
  return (
    <ButtonComponent disabled={disabled} {...rest}>
      {children}
    </ButtonComponent>
  );
};

export default Button;
