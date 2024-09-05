import React from "react";
import styled from "styled-components";
import Input from "./Input";
import Button from "./Button";

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 24px;
`;

const Form = ({ children, buttonLabel, formContent, ...rest }) => {
  return (
    <FormWrapper {...rest}>
      {formContent?.map(({ label, type, placeholder }) => (
        <Input
          key={label}
          label={label}
          type={type}
          placeholder={placeholder}
        />
      ))}
      <Button>{buttonLabel}</Button>
    </FormWrapper>
  );
};

export default Form;
