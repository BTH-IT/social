import React from "react";
import { PostType } from "../Posts/Post";
import { styled } from "styled-components";
import { SERVER } from "../../utils/constant";
import Button from "../Button/Button";
import { CommentType } from "../Posts/PostComment";

const StyledNotificationPost = styled.a`
  text-decoration: none;
  font-size: 3rem;
  color: #404040;

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border: 1px solid #e7e5e4;
  }
`;

const NotificationItemLeft = ({
  type,
  post,
}: {
  type: string;
  post: PostType;
}) => {
  if (type !== "follow") {
    return (
      <StyledNotificationPost href={`/p/${post._id}`}>
        {post.fileUploads.length > 0 && post.fileUploads[0].type === "image" ? (
          <img
            src={`${SERVER}files/${post.fileUploads[0].filename}`}
            alt="post"
          />
        ) : (
          <i className="bi bi-file-post-fill"></i>
        )}
      </StyledNotificationPost>
    );
  }

  return (
    <Button className="notification-item_button" primary={1}>
      Follow
    </Button>
  );
};

export default NotificationItemLeft;
