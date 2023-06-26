import styled from "styled-components";
interface ButtonProps {
  children: String;
  className?: String;
  primary?: 1 | 0;
  onClick?: () => void;
  disabled?: boolean;
}

const StyledButton = styled.button<{ primary?: 1 | 0 }>`
  border: 1px solid ${(props) => (props.primary ? "transparent" : "black")};

  background-color: ${(props) =>
    props.primary ? "rgb(0, 149, 246)" : "white"};

  border-radius: 4px;
  color: ${(props) => (props.primary ? "white" : "black")};
  cursor: pointer;
  padding: 5px 9px;
  font-weight: 600;
`;

const Button = ({
  children,
  className,
  primary,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <StyledButton
      className={`${className}`}
      primary={primary}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
