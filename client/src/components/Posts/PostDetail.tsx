import moment from "moment";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import userApi from "../../api/userApi";
import { useAppDispatch } from "../../app/hooks";
import { authActions } from "../../redux/features/auth/authSlice";
import { SERVER } from "../../utils/constant";
import Avatar from "../Avatar/Avatar";
import { StyledTime } from "../Comment/CommentWithReply";
import { PostType, UserType } from "./Post";
import PostComment from "./PostComment";
import PostHeading from "./PostHeading";
import PostInfo from "./PostInfo";
import PostSlide from "./PostSlide";
import CommentList from "../Comment/CommentList";
import { SOCKET_SERVER } from "../../App";

const StyledInteractive = styled.div`
  border-top: 1px solid rgb(219, 219, 219);
`;

const StyledPostContentDetail = styled.div`
  display: flex;
  flex-direction: column;
  width: 482px;
  border: 1px solid rgb(219, 219, 219);
  border-radius: 0 4px 4px 0;
  background-color: white;
  justify-content: space-around;
`;

const StyledStatus = styled.div`
  padding: 16px;
  font-size: 1.4rem;
  border-top: 1px solid rgb(219, 219, 219);
  flex: 1;
  height: 100%;
  max-height: 409px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  .status-content {
    .status-content-desc {
      display: flex;
      gap: 10px;
      align-items: center;
      h6 {
        font-size: 1.4rem;
        display: inline-block;
      }
    }
  }

  .status-comments {
    margin-top: 16px;
  }
`;

const StyledPostDetail = styled.div`
  display: flex;
  justify-content: center;

  .post-detail-image {
    width: 400px;
    height: calc(100vh - 100px);
    border-radius: 4px 0 0 4px;
    overflow: hidden;
  }
`;

export interface CommentType {
  id: string;
  username: string;
  content: string;
  parentId: string;
  userId: string;
  likes: string[];
  createdAt: string;
  updateAt: string;
}

const PostDetail = ({ post }: { post: PostType }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
    fetchUser();
  }, [dispatch, navigate, post.userId]);

  return (
    <StyledPostDetail>
      {post.fileUploads.length > 0 && (
        <div className="post-detail-image">
          <PostSlide
            width="100%"
            height="100%"
            fileUploads={post.fileUploads}
          ></PostSlide>
        </div>
      )}
      <StyledPostContentDetail>
        <div className="post-detail-content-heading">
          <PostHeading
            post={post}
            username={user?.username || ""}
            avatar={user?.profilePicture || ""}
          ></PostHeading>
        </div>
        <StyledStatus>
          <div className="status-content">
            <div className="status-content-desc">
              <Avatar
                href={`/${post.userId}`}
                style={{
                  width: "44px",
                  height: "44px",
                  flexShrink: 0,
                }}
                url={user?.profilePicture || ""}
              ></Avatar>
              <div>
                <h6>{user?.fullname}</h6> {post.desc}
                <StyledTime>{moment(post.createdAt).fromNow()}</StyledTime>
              </div>
            </div>
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
        </StyledStatus>
        <StyledInteractive>
          <div
            style={{
              marginBottom: "10px",
            }}
          >
            <PostInfo post={post}></PostInfo>
          </div>
          <PostComment
            postId={post._id}
            commentRef={commentRef}
            content={content}
            setContent={setContent}
          ></PostComment>
        </StyledInteractive>
      </StyledPostContentDetail>
    </StyledPostDetail>
  );
};

export default PostDetail;
