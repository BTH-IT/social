import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppSelector } from "../../app/hooks";
import PostGrid from "../../components/PostGrid/PostGrid";

const StyledExplore = styled.div`
  max-width: 935px;
  width: 100%;
  margin: 0 auto 30px;
  padding: 30px 20px 0 20px;

  @media screen and (max-width: 786px) {
    margin-bottom: 90px;
  }
`;

const Explore = () => {
  const navigate = useNavigate();
  const loginSuccess = useAppSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!loginSuccess) {
      navigate("/login", { replace: true });
    }
  }, [loginSuccess, navigate]);

  if (!loginSuccess) {
    navigate("/login");
    return null;
  }

  return (
    <StyledExplore>
      <PostGrid></PostGrid>
    </StyledExplore>
  );
};

export default Explore;
