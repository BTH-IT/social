import React, { Suspense, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppSelector } from "../../app/hooks";
import NavMobileTop from "../../components/Nav/NavMobile/NavMobileTop";

const Posts = React.lazy(() => import("../../components/Posts/Posts"));
const StoryAvatarSlide = React.lazy(
  () => import("../../components/StoryAvatarSlide/StoryAvatarSlide")
);
const SuggestPosts = React.lazy(
  () => import("../../components/SuggestPosts/SuggestPosts")
);

const StyledHome = styled.section`
  width: 100%;
  display: flex;
  gap: 32px;
  justify-content: center;
  align-items: flex-start;
  background-color: #fafafa;
  padding-bottom: 30px;

  .home {
    flex-shrink: 0;
    width: 100%;
    max-width: 470px;
    display: inline-block;
    margin-top: 16px;

    &-slide {
      background-color: white;
      border-radius: 8px;
      border: 1px solid rgb(219, 219, 219);
      padding: 16px 0;
    }
  }

  @media screen and (max-width: 768px) {
    padding: 60px 0 90px 0;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const loginSuccess = useAppSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!loginSuccess) {
      navigate("/login");
    }
  }, [loginSuccess, navigate]);

  return (
    <StyledHome>
      <div className="home">
        <NavMobileTop></NavMobileTop>
        <div className="home-slide">
          <Suspense fallback={<p>Loading....</p>}>
            <StoryAvatarSlide></StoryAvatarSlide>
          </Suspense>
        </div>
        <div className="home-posts">
          <Suspense fallback={<p>Loading....</p>}>
            <Posts></Posts>
            <SuggestPosts></SuggestPosts>
          </Suspense>
        </div>
      </div>
    </StyledHome>
  );
};

export default Home;
