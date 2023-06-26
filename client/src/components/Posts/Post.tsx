import { useState, useEffect, useRef } from "react";
import PostHeading from "./PostHeading";
import PostInfo from "./PostInfo";
import PostSlide from "./PostSlide";
import styled from "styled-components";
import userApi from "../../api/userApi";
import { Link, useNavigate } from "react-router-dom";
import { authActions } from "../../redux/features/auth/authSlice";
import { useAppDispatch } from "../../app/hooks";
import { CommentType } from "./PostDetail";
import { SOCKET_SERVER } from "../../App";
import { FileUploadsType } from "../Create/Create";
import PostComment from "./PostComment";

export interface PostType {
  _id: string;
  userId: string;
  desc: string;
  saved: string[];
  likes: string[];
  comments: [];
  fileUploads: FileUploadsType[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  feeling?: string;
  tagUser?: string[];
}

export interface UserType {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  profilePicture: FileUploadsType;
  desc: string;
  posts: string[];
  followers: string[];
  followings: string[];
  saved: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const StyledPost = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid rgb(219, 219, 219);
  margin-top: 15px;

  .post-slide {
    width: 100%;
    height: 100%;
  }

  .post-content {
    padding: 0 12px;
  }

  .post-desc {
    font-size: 1.4rem;
    text-align: justify;
    margin-bottom: 10px;
    h6 {
      font-size: 1.4rem;
      display: inline-block;
    }
  }

  .post-show-comment {
    font-weight: 400;
    font-size: 1.4rem;
    color: #8e8e8e;
    cursor: pointer;
    display: block;
    margin-bottom: 10px;
    text-decoration: none;
  }
`;

const Post = ({ post }: { post: PostType }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<UserType | null>(null);
  const [comments, setComments] = useState<CommentType[] | null>(post.comments);
  const [content, setContent] = useState("");
  const commentRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function fetchUser() {
      if (post.userId) {
        try {
          const res = await userApi.get(post.userId);
          setUser(res.data);
        } catch (error: any) {
          if (error.response.status === 401) {
            navigate("/login");
            dispatch(authActions.logout());
          }
        }
      }
    }
    fetchUser();
  }, [dispatch, navigate, post.userId]);

  useEffect(() => {
    if (SOCKET_SERVER) {
      SOCKET_SERVER.on("added-comment", (socketPost) => {
        if (socketPost._id === post._id) {
          setComments(socketPost.comments);
        }
      });
    }
  }, []);

  return (
    <>
      <StyledPost>
        <PostHeading
          post={post}
          username={user?.username || ""}
          avatar={
            user?.profilePicture.url ||
            "https://img.myloview.com/stickers/default-avatar-profile-image-vector-social-media-user-icon-400-228654854.jpg"
          }
        ></PostHeading>

        {post.fileUploads.length > 0 && (
          <div className="post-slide">
            <PostSlide
              width="100%"
              height="600px"
              fileUploads={post.fileUploads}
            ></PostSlide>
          </div>
        )}

        <PostInfo post={post} hasModal>
          <div className="post-content">
            <div className="post-desc">
              <h6>{user?.fullname}</h6> {post.desc}
            </div>
            {comments && comments.length > 0 && (
              <Link to={`/p/${post._id}`} className="post-show-comment">
                View all {comments.length} comments
              </Link>
            )}
          </div>
        </PostInfo>

        <PostComment
          postId={post._id}
          commentRef={commentRef}
          content={content}
          setContent={setContent}
        ></PostComment>
      </StyledPost>
    </>
  );
};

export default Post;
