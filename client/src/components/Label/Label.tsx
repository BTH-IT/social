import React from "react";
import styled from "styled-components";

const StyledLabel = styled.label`
  margin-bottom: 10px;
  font-size: 1.6rem;
  display: block;
`;

const Label = ({
  children,
  htmlFor,
}: {
  children: string;
  htmlFor: string;
}) => {
  return <StyledLabel htmlFor={htmlFor}>{children}</StyledLabel>;
};

export default Label;
