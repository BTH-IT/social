import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import * as yup from "yup";
import authApi from "../../api/authApi";
import Button from "../../components/Button/Button";
import InputForm from "../../components/Input/InputForm";

export interface SignType {
  email: string;
  fullname: string;
  username: string;
  password: string;
}

const StyledSignUp = styled.form`
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

const StyledSingUpPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const signSchema = yup.object({
  email: yup
    .string()
    .required("This field is a required field")
    .email("This field must to be an email"),
  fullname: yup.string().required("This field is a required field"),
  username: yup.string().required("This field is a required field"),
  password: yup
    .string()
    .required("This field is a required field")
    .max(20, "This field must less than or equal to 20")
    .min(4, "This field must better than or equal to 4"),
});

const Signup = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<SignType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(signSchema),
    mode: "onChange",
  });

  const handleSignUp = async (values: SignType) => {
    if (!isValid || isSubmitting) return;

    try {
      await authApi.register(values);
      toast.success("Wellcome to the website!!");
      navigate("/login");
    } catch (error: any) {
      toast.error("This account or email is already existed!!");
    }
  };

  return (
    <StyledSingUpPage>
      <StyledSignUp onSubmit={handleSubmit(handleSignUp)}>
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
          title="Fullname"
          name="fullname"
          placeholder="Fullname"
          id="fullname"
          className="form-input"
          type="text"
        ></InputForm>
        <InputForm
          control={control}
          title="Username"
          name="username"
          placeholder="Username"
          id="username"
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
          Sign Up
        </Button>
        <span>
          Have an account?
          <Link to="/login" className="link">
            Log In
          </Link>
        </span>
      </StyledSignUp>
    </StyledSingUpPage>
  );
};

export default Signup;
