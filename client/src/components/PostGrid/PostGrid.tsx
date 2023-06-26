import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import postApi from "../../api/postApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { authActions } from "../../redux/features/auth/authSlice";
import { SERVER } from "../../utils/constant";
import { PostType } from "../Posts/Post";

const StyledPostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 20px;

  .profile-grid {
    &_item {
      width: 100%;
      height: 293px;
      transition: all 0.2s ease;

      img,
      video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: all 0.2s ease;
        display: block;
        &:hover {
          background-color: #fafaf9;
        }
      }

      &:hover {
        filter: brightness(0.8);
      }
    }
  }

  @media screen and (max-width: 526px) {
    grid-template-columns: repeat(2, auto);
  }

  @media screen and (max-width: 426px) {
    grid-template-columns: repeat(1, auto);
  }
`;

const PostGrid = () => {
  const { pathname } = useLocation();
  const userId = pathname.split("/")[1];
  const methodApi = pathname.split("/")[2];

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [postList, setPostList] = useState<PostType[]>([]);
  useEffect(() => {
    async function fetchPosts() {
      try {
        if (userId === "explore") {
          const res = await postApi.getAllPost();
          setPostList(res.data);
        } else if (!methodApi) {
          const res = await postApi.getYourTimeline(userId);
          setPostList(res.data);
        } else if (methodApi === "saved") {
          const res = await postApi.getSavedPost(userId);
          setPostList(res.data);
        } else {
          setPostList([]);
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/login");
          dispatch(authActions.logout());
        }
      }
    }
    fetchPosts();
  }, [currentUser?._id, dispatch, methodApi, navigate, pathname, userId]);

  return (
    <StyledPostGrid>
      {postList.length > 0 &&
        postList.map((post) => (
          <Link
            to={`/p/${post._id}`}
            className="profile-grid_item"
            key={post._id}
          >
            {post.fileUploads.length > 0 ? (
              <>
                {post.fileUploads[0].type === "image" ? (
                  <img
                    src={post.fileUploads[0].url}
                    alt={post.fileUploads[0].id}
                  />
                ) : (
                  <video src={post.fileUploads[0].url} controls></video>
                )}
              </>
            ) : (
              <img src="/src/assets/file-post.svg" alt="" />
            )}
          </Link>
        ))}
    </StyledPostGrid>
  );
};

export default PostGrid;
