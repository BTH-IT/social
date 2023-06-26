import moment from "moment";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import postApi from "../../api/postApi";
import userApi from "../../api/userApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { authActions } from "../../redux/features/auth/authSlice";
import { SERVER } from "../../utils/constant";
import Avatar from "../Avatar/Avatar";
import { CommentType } from "../Posts/PostDetail";
import { SOCKET_SERVER } from "../../App";
import notiApi from "../../api/notiApi";

const StyledComment = styled.div`
  font-size: 1.2rem;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  a {
    color: rgb(38, 38, 38);
    text-decoration: none;
  }

  h6 {
    display: inline-block;
    font-size: 1.2rem;
  }

  .comment-react {
    cursor: pointer;

    i.bi-heart-fill {
      color: #ed4956;
    }
  }
`;

const StyledCommentContent = styled.div`
  display: flex;
  gap: 10px;
  flex: 1;
  align-items: flex-start;

  a {
    font-weight: 500;
  }
`;

const StyledInteractive = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 5px;
  color: #8e8e8e;
`;

export const StyledTime = styled.div`
  font-weight: 300;
`;

export const StyledLike = styled.div`
  font-weight: 400;
  cursor: pointer;
`;

export const StyledReply = styled.div`
  font-weight: 500;
  cursor: pointer;
`;

const CommentWithReply = ({
  postId,
  commentParent,
  children,
  setContent,
  commentRef,
}: {
  postId: string;
  commentParent: CommentType;
  children?: ReactNode;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  commentRef: React.MutableRefObject<HTMLInputElement | null>;
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [heart, setHeart] = useState<boolean>(
    Boolean(commentParent.likes?.find((like) => like === currentUser?._id))
  );
  const replyRef = useRef<HTMLDivElement | null>(null);
  const [commentContent, setCommentContent] = useState<string>("");

  useEffect(() => {
    async function fetchUser() {
      if (commentParent.content !== "") {
        const regex = /@\[.+?\]\(.+?\)/gm;
        const displayRegex = /@\[.+?\]/g;
        const idRegex = /\(.+?\)/g;
        const matches = commentParent.content.match(regex);
        const arr: any[] = [];
        matches?.forEach((m: any) => {
          const id = m.match(idRegex)[0].replace("(", "").replace(")", "");
          const display = m
            .match(displayRegex)[0]
            .replace("@[", "")
            .replace("]", "");
          arr.push({ id: id, display: display });
        });
        const newComment = commentParent.content.split(regex);
        let output = "";
        for (let i = 0; i < newComment.length; i++) {
          const c = newComment[i];
          if (i === newComment.length - 1) output += c;
          else {
            const { data } = await userApi.getUserIdByUsername(arr[i].display);
            output += c + `<a href="/${data}">@${arr[i].display}</a>`;
          }
        }
        setCommentContent(output);
      }
    }

    fetchUser();
  }, [commentParent.content]);

  const handleHeartComment = async () => {
    try {
      if (currentUser) {
        const { data: post } = await postApi.likeCommentPost(
          postId,
          currentUser._id,
          commentParent.id
        );

        if (heart) {
          commentParent.likes?.splice(
            commentParent.likes?.findIndex((like) => like === currentUser?._id),
            1
          );
        } else {
          commentParent.likes?.push(currentUser._id);
        }
        setHeart(!heart);
        let notification = null;
        if (heart && post.userId !== currentUser._id) {
          notification = {
            type: "like-comment",
            post,
            comment: commentParent,
            userAction: currentUser,
            message: "liked your comment",
            createdAt: new Date(),
          };
          await notiApi.addNotificationByUserId(notification, post.userId);
        }
        SOCKET_SERVER.emit("heart-comment", post, notification);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        navigate("/login");
        dispatch(authActions.logout());
      }
    }
  };

  const handleReplyComment = async () => {
    if (replyRef && replyRef.current) {
      const commentId = replyRef.current.dataset.commentId;
      const userId = replyRef.current.dataset.userId;
      const parentCommentId = replyRef.current.dataset.parentCommentId;

      if (commentId && userId && commentRef && commentRef.current) {
        try {
          const { data: user } = await userApi.get(userId);
          commentRef.current.dataset.userId = userId;
          commentRef.current.dataset.parentId = commentId;
          commentRef.current.dataset.parentCommentId = parentCommentId;
          setContent(`@[${user.username}](${user.fullname}) `);
          commentRef.current.focus();
        } catch (error: any) {
          if (error.response.status === 401) {
            navigate("/login");
            dispatch(authActions.logout());
          }
        }
      }
    }
  };

  return (
    <div>
      <StyledComment>
        <StyledCommentContent>
          <Avatar
            href={`/${commentParent.userId}`}
            style={{
              width: "44px",
              height: "44px",
              flexShrink: 0,
            }}
            url={currentUser?.profilePicture}
          ></Avatar>
          <div>
            <a href={`/${commentParent.userId}`}>
              <h6>{commentParent.username}</h6>
            </a>{" "}
            <span
              dangerouslySetInnerHTML={{
                __html: commentContent.replace(/\n\r?/g, "<br />"),
              }}
            >
              {/* {commentContent} */}
            </span>
            <StyledInteractive>
              <StyledTime>
                {moment(commentParent.createdAt).fromNow()}
              </StyledTime>
              {commentParent.likes.length > 0 && (
                <StyledLike>{commentParent.likes.length} likes</StyledLike>
              )}
              <StyledReply
                onClick={handleReplyComment}
                ref={replyRef}
                data-comment-id={commentParent.id}
                data-user-id={commentParent.userId}
                data-parent-comment-id={commentParent.parentId || ""}
              >
                Reply
              </StyledReply>
            </StyledInteractive>
          </div>
        </StyledCommentContent>
        <div className="comment-react" onClick={handleHeartComment}>
          {heart ? (
            <i className="bi bi-heart-fill"></i>
          ) : (
            <i className="bi bi-heart"></i>
          )}
        </div>
      </StyledComment>
      {children}
    </div>
  );
};

export default CommentWithReply;
