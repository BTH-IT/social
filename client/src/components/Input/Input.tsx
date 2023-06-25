import React, { useEffect, useLayoutEffect, useRef } from "react";
import styled from "styled-components";
interface InputProps {
  hasIcon?: true | false;
  placeholder: string;
  className?: string;
  primary?: 1 | 0;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  id?: string;
  type?: string | "text";
  children?: React.ReactNode;
  defaultValue?: string;
}

const StyledInput = styled.div<{ primary?: 1 | 0 }>`
  position: relative;

  input {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    border-radius: 6px;
    font-size: 1.6rem;
    padding: ${(props) => (props.primary ? "12px 16px" : "")};
    background-color: ${(props) => (props.primary ? "#efefef" : "transparent")};
    color: rgb(38, 38, 38);
    font-weight: 200;
    display: block;
    padding: 10px;
  }

  i {
    color: rgb(38, 38, 38);
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
    opacity: 0.6;
    cursor: pointer;
    font-size: 1.4rem;
  }
`;

const Input = ({
  hasIcon,
  placeholder,
  className,
  primary,
  onChange,
  onKeyPress,
  id,
  type,
  children,
  defaultValue,
}: InputProps) => {
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useLayoutEffect(() => {
    if (!defaultValue) {
      (inputRef.current as HTMLInputElement).value = "";
    }
  }, []);

  return (
    <StyledInput className={`${className}`} primary={primary}>
      <input
        type={type}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (onChange) {
            onChange(e);
          }
        }}
        onKeyPress={async (e) => {
          if (e.code === "Enter" && !e.shiftKey) {
            e.preventDefault();

            if (onKeyPress) {
              onKeyPress(e);
            }
            return;
          }
        }}
        defaultValue={defaultValue}
        id={id}
        ref={inputRef}
      />
      {hasIcon ? children : null}
    </StyledInput>
  );
};

export default Input;
