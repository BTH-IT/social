import React, { useState } from "react";
import { useController, Control } from "react-hook-form";
import styled from "styled-components";
import { SignType } from "../../pages/Auth/Signup";
import Label from "../Label/Label";
import { LoginType } from "../RightLogin/RightLogin";

interface InputFormProps {
  hasIcon?: true | false;
  placeholder: string;
  className?: string;
  primary?: true | false;
  id: string;
  type: string | "text";
  name: "email" | "password" | "fullname" | "username";
  control: Control<LoginType | SignType | any>;
  title: string;
}

const StyledInput = styled.div`
  position: relative;

  input {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    border-radius: 6px;
    font-size: 1.6rem;
    padding: 12px 16px;
    background-color: #fafafa;
    color: rgb(38, 38, 38);
    font-weight: 200;
    display: block;
    padding: 10px;
  }

  span {
    color: red;
    margin-bottom: 10px;
  }

  .icon {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    z-index: 3;
    opacity: 0.6;
    cursor: pointer;
    i {
      color: rgb(38, 38, 38);
      font-size: 1.4rem;
    }
  }
`;

const InputForm = ({
  title,
  control,
  hasIcon,
  type,
  ...props
}: InputFormProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: props.name,
    control,
    defaultValue: "",
  });

  const [show, setShow] = useState(false);

  return (
    <div>
      <Label htmlFor={props.id}>{title}</Label>
      <StyledInput>
        <input {...props} {...field} type={show ? "text" : type} />
        {error ? <span>{error.message}</span> : null}
        {hasIcon && (
          <div className="icon">
            {show ? (
              <i className="bi bi-eye-fill" onClick={() => setShow(!show)}></i>
            ) : (
              <i
                className="bi bi-eye-slash-fill"
                onClick={() => setShow(!show)}
              ></i>
            )}
          </div>
        )}
      </StyledInput>
    </div>
  );
};

export default InputForm;
