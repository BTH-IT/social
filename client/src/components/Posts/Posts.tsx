import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import postApi from "../../api/postApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { authActions } from "../../redux/features/auth/authSlice";
import Post, { PostType } from "./Post";

const Posts = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [postList, setPostList] = useState<PostType[]>([]);
  useEffect(() => {
    async function fetchPosts() {
      try {
        if (currentUser?._id) {
          const res = await postApi.getTimeline(currentUser?._id);
          setPostList(res.data);
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/login");
          dispatch(authActions.logout());
        }
      }
    }
    fetchPosts();
  }, [currentUser?._id, dispatch, navigate]);

  return (
    <>
      {postList.length > 0 &&
        postList.map((post: PostType) => (
          <Post key={post._id + currentUser?._id} post={post}></Post>
        ))}
    </>
  );
};

export default Posts;
