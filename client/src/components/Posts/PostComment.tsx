import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import postApi from "../../api/postApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { authActions } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { SOCKET_SERVER, customStyle } from "../../utils/constant";
import { Mention, MentionsInput } from "react-mentions";
import mentionsStyles from "../../utils/mentionsStyles";
import { UserType } from "./Post";
import userApi from "../../api/userApi";

const StyledPostComment = styled.div`
  border-top: 2px solid rgb(239, 239, 239);
  color: rgb(142, 142, 142);
  display: flex;
  gap: 5px;
  justify-content: space-between;
  align-items: center;

  & > div {
    flex: 1;
    max-width: 100%;
  }

  .post-comment-btn {
    flex-shrink: 0;
    flex-basis: auto;
    color: rgb(0, 149, 246);
    font-weight: 500;
    font-size: 1.4rem;
    padding-right: 10px;
    cursor: pointer;
    &.disabled {
      opacity: 0.6;
      cursor: default;
    }
  }
`;

export interface CommentType {
  username: string;
  content: string;
  parentId?: string;
  userId: string;
}

export interface UserMentionType {
  id: string;
  display: string;
}

const PostComment = ({
  postId,
  commentRef,
  content,
  setContent,
}: {
  postId: string;
  commentRef: React.MutableRefObject<HTMLInputElement | null>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const postBtnRef = useRef<HTMLDivElement | null>(null);
  const [userList, setUserList] = useState<UserMentionType[] | []>([]);

  useEffect(() => {
    if (commentRef.current) {
      commentRef.current.blur();
      window.scrollTo({
        top: 0,
      });
    }
  }, [commentRef.current]);

  useEffect(() => {
    try {
      async function fetchUser() {
        const { data } = await userApi.getAll();

        const userMentionList = data.map((user: UserType): UserMentionType => {
          return {
            id: user.fullname,
            display: user.username,
          };
        });

        setUserList(userMentionList);
      }

      fetchUser();
    } catch (error: any) {
      if (error.response.status === 401) {
        navigate("/login");
        dispatch(authActions.logout());
      }
    }
  }, []);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ((e.target as HTMLInputElement).value) {
      (postBtnRef.current as HTMLDivElement).classList.remove("disabled");
    } else {
      (postBtnRef.current as HTMLDivElement).classList.add("disabled");
    }

    setContent((e.target as HTMLInputElement).value);
  };

  const handlePostComment = async () => {
    if (!content) return;

    const newContent = content.replace(
      /(\[|\]|\(([A-Za-z1-9\s]|[^\u0000-\u007F]+)+\))/g,
      ""
    );

    if (currentUser?.username && currentUser?._id) {
      let parentId = undefined;

      if (
        commentRef.current?.dataset.parentId &&
        commentRef.current?.dataset.parentCommentId !== "undefined"
      ) {
        parentId = commentRef.current?.dataset.parentCommentId;
      } else if (commentRef.current?.dataset.parentId) {
        parentId = commentRef.current?.dataset.parentId;
      }

      try {
        const data = {
          username: currentUser.username,
          content: newContent,
          parentId,
          userId: currentUser._id,
        };

        const { data: post } = await postApi.commentPost(postId, data);
        (commentRef.current as HTMLInputElement).value = "";
        setContent("");
        SOCKET_SERVER.emit("add-comment", post);

        (commentRef.current as HTMLInputElement).dataset.parentId = "";
        (commentRef.current as HTMLInputElement).dataset.parentCommentId = "";
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/login");
          dispatch(authActions.logout());
        }
      }
    }
  };

  return (
    <StyledPostComment>
      <MentionsInput
        style={customStyle}
        value={content || ""}
        onChange={(e) => handleTyping(e as React.ChangeEvent<HTMLInputElement>)}
        onKeyPress={async (e) => {
          if (e.code === "Enter" && !e.shiftKey) {
            e.preventDefault();

            await handlePostComment();
            return;
          }
        }}
        inputRef={commentRef}
        placeholder="Add a comment..."
      >
        <Mention
          displayTransform={(id) => `@${id}`}
          trigger="@"
          style={mentionsStyles}
          data={userList}
        />
      </MentionsInput>
      <p
        className="post-comment-btn disabled"
        ref={postBtnRef}
        onClick={handlePostComment}
      >
        Post
      </p>
    </StyledPostComment>
  );
};

export default PostComment;
