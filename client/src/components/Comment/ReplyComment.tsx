import React, { useState } from "react";
import { styled } from "styled-components";
import { CommentType } from "../Posts/PostDetail";
import CommentWithReply from "./CommentWithReply";

const ReplyCommentStyled = styled.div`
  margin: 8px 0 20px 55px;
  font-size: 1.2rem;
  cursor: pointer;
  .line {
    border-bottom: 1px solid rgb(115, 115, 115);
    display: inline-block;
    margin-right: 12px;
    padding: 0;
    vertical-align: middle;
    width: 24px;
  }

  .replies {
    color: rgb(115, 115, 115);
    font-weight: 500;
  }

  .comment-list {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    cursor: default;
  }
`;

const ReplyComment = ({
  comments,
  postId,
  setContent,
  commentRef,
}: {
  comments: CommentType[];
  postId: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  commentRef: React.MutableRefObject<HTMLInputElement | null>;
}) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <ReplyCommentStyled>
      <div className="line"></div>
      <span onClick={() => setShow((prev) => !prev)} className="replies">
        {show ? "Hide" : "View"} replies ({comments.length})
      </span>
      {show && (
        <div className="comment-list">
          {comments.map((comment) => (
            <CommentWithReply
              key={comment.id}
              postId={postId}
              commentParent={comment}
              setContent={setContent}
              commentRef={commentRef}
            ></CommentWithReply>
          ))}
        </div>
      )}
    </ReplyCommentStyled>
  );
};

export default ReplyComment;
