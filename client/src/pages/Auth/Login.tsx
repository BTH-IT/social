import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppSelector } from "../../app/hooks";
import LeftLogin from "../../components/LeftLogin/LeftLogin";
import RightLogin from "../../components/RightLogin/RightLogin";

const StyledLogin = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  gap: 20px;
  background-color: #fafafa;
`;

const Login = () => {
  const navigate = useNavigate();
  const loginSuccess = useAppSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (loginSuccess) {
      navigate("/");
    }
  }, [loginSuccess, navigate]);

  return (
    <StyledLogin>
      <LeftLogin></LeftLogin>
      <RightLogin></RightLogin>
    </StyledLogin>
  );
};

export default Login;
