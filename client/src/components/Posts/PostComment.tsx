import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import postApi from "../../api/postApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { authActions } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { customStyle } from "../../utils/constant";
import { Mention, MentionsInput } from "react-mentions";
import mentionsStyles from "../../utils/mentionsStyles";
import { UserType } from "./Post";
import userApi from "../../api/userApi";
import { SOCKET_SERVER } from "../../App";
import notiApi from "../../api/notiApi";

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
  if (!commentRef) return <></>;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const postBtnRef = useRef<HTMLDivElement | null>(null);
  const [userList, setUserList] = useState<UserMentionType[] | []>([]);
  const [emojiValue, setEmojiValue] = useState([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const notMatchingRegex = /($a)/;

  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/oliveratgithub/0bf11a9aff0d6da7b46f1490f86a71eb/raw/d8e4b78cfe66862cf3809443c1dba017f37b61db/emojis.json"
    )
      .then((data) => {
        return data.json();
      })
      .then((jsonData) => {
        setEmojiValue(jsonData.emojis);
      });
  }, []);

  useEffect(() => {
    if (commentRef && commentRef.current) {
      commentRef.current.blur();
      window.scrollTo({
        top: 0,
      });
    }
  }, [commentRef]);

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
    if (!content || isDisabled) return;

    if (currentUser && currentUser?.username && currentUser?._id) {
      setIsDisabled(true);
      let parentId = undefined;
      const commentUserId = commentRef.current?.dataset.userId;

      if (
        commentRef.current?.dataset.parentId &&
        commentRef.current?.dataset.parentCommentId
      ) {
        parentId = commentRef.current?.dataset.parentCommentId;
      } else if (commentRef.current?.dataset.parentId) {
        parentId = commentRef.current?.dataset.parentId;
      } else {
        parentId = undefined;
      }

      try {
        const data = {
          username: currentUser.username,
          content,
          parentId,
          userId: currentUser._id,
        };

        const { data: post } = await postApi.commentPost(postId, data);

        let notification = null;
        if (
          post.userId !== currentUser._id ||
          commentUserId !== currentUser._id
        ) {
          if (parentId === undefined) {
            notification = {
              type: "add-comment",
              post,
              userAction: currentUser,
              message: "commented on this post",
              createdAt: new Date(),
            };
            await notiApi.addNotificationByUserId(notification, post.userId);
          } else if (commentUserId) {
            console.log(commentUserId);
            notification = {
              type: "reply-comment",
              post,
              userAction: currentUser,
              message: "replied your comment on this post",
              createdAt: new Date(),
            };
            await notiApi.addNotificationByUserId(notification, commentUserId);
          }
        }

        SOCKET_SERVER.emit("add-comment", post, notification);

        (commentRef.current as HTMLInputElement).value = "";
        setContent("");
        (commentRef.current as HTMLInputElement).dataset.parentId = "";
        (commentRef.current as HTMLInputElement).dataset.parentCommentId = "";
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/login");
          dispatch(authActions.logout());
        }
      } finally {
        setIsDisabled(false);
      }
    }
  };

  const queryEmojis = (query: any, callback: any) => {
    if (query.length === 0) return;
    const filterValue = emojiValue
      .filter((emoji: any) => {
        return emoji.name.indexOf(query.toLowerCase()) > -1;
      })
      .slice(0, 10);
    return filterValue.map(({ emoji }: any) => ({ id: emoji }));
  };

  return (
    <>
      <StyledPostComment>
        <MentionsInput
          style={customStyle}
          value={content || ""}
          onChange={(e) =>
            handleTyping(e as React.ChangeEvent<HTMLInputElement>)
          }
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
          <Mention
            trigger=":"
            markup="__id__"
            regex={notMatchingRegex}
            data={queryEmojis}
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
    </>
  );
};

export default PostComment;
