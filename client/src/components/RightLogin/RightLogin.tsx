import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { useAppDispatch } from "../../app/hooks";
import { authActions } from "../../redux/features/auth/authSlice";
import Button from "../Button/Button";
import InputForm from "../Input/InputForm";

export interface LoginType {
  email: string;
  password: string;
}

const StyledRightLogin = styled.form`
  padding: 10px 20px;
  border: 1px solid rgb(219, 219, 219);
  background-color: white;
  max-width: 350px;
  width: 100%;

  .form-heading {
    text-align: center;
    font-size: 4rem;
    margin-bottom: 20px;
  }

  .form-input {
    margin-bottom: 10px;
    border: 1px solid rgb(219, 219, 219);
  }

  .form-btn {
    width: 100%;
    height: 45px;
    margin: 10px 0;
  }

  span {
    font-size: 1.6rem;
    display: flex;
    gap: 10px;
    .link {
      text-decoration: none;
      color: rgb(0, 149, 246);
      font-weight: 500;
    }
  }
`;

const loginSchema = yup.object({
  email: yup
    .string()
    .required("This field is a required field")
    .email("This field must to be an email"),
  password: yup
    .string()
    .required("This field is a required field")
    .max(20, "This field must less than or equal to 20")
    .min(4, "This field must better than or equal to 4"),
});

const RightLogin = () => {
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<LoginType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const handleLogin = async (values: LoginType) => {
    if (!isValid || isSubmitting) return;

    dispatch(authActions.login(values));
  };

  return (
    <StyledRightLogin onSubmit={handleSubmit(handleLogin)}>
      <h2 className="form-heading">𝘽𝙏𝙃 𝙎𝙤𝙘𝙞𝙖𝙡</h2>
      <InputForm
        control={control}
        title="Email"
        name="email"
        placeholder="Email"
        id="email"
        className="form-input"
        type="text"
      ></InputForm>
      <InputForm
        control={control}
        hasIcon={true}
        title="Password"
        name="password"
        placeholder="Password"
        id="password"
        className="form-input"
        type="password"
      ></InputForm>
      <Button primary={1} className="form-btn">
        Log in
      </Button>
      <span>
        Don't have an account?
        <Link to="/signup" className="link">
          Sign Up
        </Link>
      </span>
    </StyledRightLogin>
  );
};

export default RightLogin;
