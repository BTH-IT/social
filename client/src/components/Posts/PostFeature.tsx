import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import deleteFile from "../../api/deleteFile";
import postApi from "../../api/postApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { authActions } from "../../redux/features/auth/authSlice";
import { FileNameType } from "../Create/Create";
import { PostType } from "./Post";

interface FeaturePostProps {
  onClose: () => void;
  post: PostType;
}

const StyledFeaturePost = styled.div`
  border: none;
  background-color: white;
  border-radius: 6px;
  width: 400px;
  font-weight: 500;
  font-size: 1.6rem;
  color: #262626;

  div,
  a {
    text-align: center;
    padding: 14px 0;
    border-top: 1px solid rgb(219, 219, 219);
    border-bottom: 1px solid rgb(219, 219, 219);
    opacity: 0.8;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .red {
    color: #b91c1c;
  }

  @media screen and (max-width: 526px) {
    width: 250px;
  }
`;

const PostFeature = ({ onClose, post }: FeaturePostProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  return (
    <StyledFeaturePost onClick={onClose}>
      {currentUser?._id === post.userId && (
        <div
          className="red"
          onClick={async () => {
            try {
              await postApi.deletePost(post._id, currentUser._id);
              post.fileUploads.forEach(async (file: FileNameType) => {
                await deleteFile(file.filename);
              });
              toast.success("Delete post successfully");
              window.location.reload();
            } catch (error: any) {
              if (error.response.status === 401) {
                navigate("/login");
                dispatch(authActions.logout());
              }
            }
          }}
        >
          Remove Post
        </div>
      )}
      <Link to={`/p/${post._id}`}>Go to post</Link>
      <Link to={`/${currentUser?._id}`}>Go to profile</Link>
      <div>Cancel</div>
    </StyledFeaturePost>
  );
};

export default PostFeature;
