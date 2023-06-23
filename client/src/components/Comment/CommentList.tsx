import React from "react";
import { CommentType } from "../Posts/PostDetail";
import CommentWithReply from "./CommentWithReply";
import ReplyComment from "./ReplyComment";

type CommentListType = {
  parent: CommentType;
  child: CommentType[];
};

const CommentList = ({
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
  const commentParents: CommentType[] = comments.filter(
    (comment) => comment.parentId === null || comment.parentId === ""
  );

  const replyComments: CommentListType[] = commentParents.map(
    (commentParent) => {
      const commentChild = comments.filter(
        (commentChild) => commentChild.parentId === commentParent.id
      );

      return {
        parent: commentParent,
        child: commentChild,
      };
    }
  );

  return (
    <>
      {replyComments.length > 0 &&
        replyComments.map((replyComment) => (
          <CommentWithReply
            key={replyComment.parent.id}
            commentParent={replyComment.parent}
            postId={postId}
            setContent={setContent}
            commentRef={commentRef}
          >
            {replyComment.child.length > 0 && (
              <ReplyComment
                comments={replyComment.child}
                postId={postId}
                setContent={setContent}
                commentRef={commentRef}
              ></ReplyComment>
            )}
          </CommentWithReply>
        ))}
    </>
  );
};

export default CommentList;
