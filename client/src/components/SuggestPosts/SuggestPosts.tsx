import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import postApi from "../../api/postApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { authActions } from "../../redux/features/auth/authSlice";
import Post, { PostType } from "../Posts/Post";

const StyledSuggestPosts = styled.div`
  margin-top: 20px;
  color: #262626;

  h4 {
    font-size: 2rem;
    font-weight: 500;
  }
`;

const SuggestPosts = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [postList, setPostList] = useState<PostType[]>([]);
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await postApi.getAllPost();
        setPostList(res.data);
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/login");
          dispatch(authActions.logout());
        }
      }
    }
    fetchPosts();
  }, [currentUser?._id, dispatch, navigate]);

  const postFilter = postList.filter(
    (post) => post.userId !== currentUser?._id
  );

  return (
    <StyledSuggestPosts>
      {postFilter.length > 0 && (
        <>
          <h4>Suggested Posts</h4>
          {postFilter.map((post) => (
            <Post key={post._id + currentUser?._id} post={post}></Post>
          ))}
        </>
      )}
    </StyledSuggestPosts>
  );
};

export default SuggestPosts;
