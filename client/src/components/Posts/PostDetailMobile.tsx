import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import userApi from "../../api/userApi";
import { useAppDispatch } from "../../app/hooks";
import { authActions } from "../../redux/features/auth/authSlice";
import { SERVER } from "../../utils/constant";
import Comment from "../Comment/Comment";
import { PostType, UserType } from "./Post";
import PostComment from "./PostComment";
import { CommentType } from "./PostDetail";
import PostHeading from "./PostHeading";
import PostInfo from "./PostInfo";
import PostSlide from "./PostSlide";
import { SOCKET_SERVER } from "../../App";
import CommentList from "../Comment/CommentList";

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

const PostDetailMobile = ({ post }: { post: PostType }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<UserType | null>(null);
  const [comments, setComments] = useState<CommentType[] | null>(post.comments);
  const [content, setContent] = useState("");
  const commentRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (SOCKET_SERVER) {
      SOCKET_SERVER.on("added-comment", (socketPost) => {
        if (socketPost._id === post._id) {
          setComments(socketPost.comments);
        }
      });

      SOCKET_SERVER.on("hearted-comment", (socketPost) => {
        if (socketPost._id === post._id) {
          setComments(socketPost.comments);
        }
      });
    }
  }, []);

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

  return (
    <>
      <StyledPost>
        <PostHeading
          post={post}
          username={user?.username || ""}
          avatar={
            user?.profilePicture?.url ||
            "https://img.myloview.com/stickers/default-avatar-profile-image-vector-social-media-user-icon-400-228654854.jpg"
          }
        ></PostHeading>

        <div className="post-slide">
          <PostSlide
            width="100%"
            height="600px"
            fileUploads={post.fileUploads}
          ></PostSlide>
        </div>

        <PostInfo post={post} hasModal>
          <div className="post-content">
            <div className="post-desc">
              <h6>{user?.username}</h6> {post.desc}
            </div>
            <div className="status-comments">
              {comments && comments.length > 0 && (
                <CommentList
                  comments={comments}
                  postId={post._id}
                  commentRef={commentRef}
                  setContent={setContent}
                ></CommentList>
              )}
            </div>
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

export default PostDetailMobile;
