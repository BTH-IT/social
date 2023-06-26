import React, { useEffect, useMemo, useState } from "react";
import { PostType, UserType } from "../Posts/Post";
import { styled } from "styled-components";
import { SERVER } from "../../utils/constant";
import Button from "../Button/Button";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import userApi from "../../api/userApi";
import { authActions } from "../../redux/features/auth/authSlice";
import notiApi from "../../api/notiApi";
import { SOCKET_SERVER } from "../../App";
import { useNavigate } from "react-router-dom";

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
  userAction,
}: {
  type: string;
  post?: PostType;
  userAction: UserType;
}) => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    setIsFollowing(
      Boolean(
        currentUser?.followings.find((usr: string) => usr === userAction._id)
      )
    );
  }, [currentUser]);

  if (type !== "follow" && post !== undefined) {
    return (
      <StyledNotificationPost href={`/p/${post._id}`}>
        {post.fileUploads.length > 0 && post.fileUploads[0].type === "image" ? (
          <img src={post.fileUploads[0].url} alt={post.fileUploads[0].id} />
        ) : (
          <i className="bi bi-file-post-fill"></i>
        )}
      </StyledNotificationPost>
    );
  }

  const handleFollow = useMemo(
    () => () => {
      const handleFollowing = async () => {
        const currentUserLocal: UserType | null = JSON.parse(
          localStorage.getItem("current_user") || ""
        );
        try {
          if (userAction._id && currentUserLocal && !isFollowing) {
            await userApi.followUser(userAction._id, currentUserLocal._id);
            currentUserLocal.followings.push(userAction._id);

            localStorage.setItem(
              "current_user",
              JSON.stringify(currentUserLocal)
            );
            dispatch(authActions.updateCurrentUser(currentUserLocal));

            const notification = {
              type: "follow",
              userAction: currentUser,
              message: "started following you",
              createdAt: new Date(),
            };
            await notiApi.addNotificationByUserId(notification, userAction._id);

            SOCKET_SERVER.emit("follow", userAction._id, notification);

            setIsFollowing(true);
          }
        } catch (error: any) {
          if (error.response.status === 401) {
            navigate("/login");
            dispatch(authActions.logout());
          }
        }
      };

      const handleUnFollowing = async () => {
        const currentUserLocal: UserType | null = JSON.parse(
          localStorage.getItem("current_user") || ""
        );
        try {
          if (userAction._id && currentUserLocal) {
            await userApi.unFollowUser(userAction._id, currentUserLocal._id);

            const followingsIndex = currentUserLocal.followings.findIndex(
              (id: string) => id === userAction._id
            );

            if (followingsIndex !== -1) {
              currentUserLocal.followings.splice(followingsIndex, 1);
              localStorage.setItem(
                "current_user",
                JSON.stringify(currentUserLocal)
              );

              dispatch(authActions.updateCurrentUser(currentUserLocal));
              setIsFollowing(false);
            }
          }
        } catch (error: any) {
          if (error.response.status === 401) {
            navigate("/login");
            dispatch(authActions.logout());
          }
        }
      };

      if (isFollowing) {
        handleUnFollowing();
        return;
      }

      handleFollowing();
    },
    [isFollowing]
  );

  return (
    <Button
      className="notification-item_button"
      primary={isFollowing ? 0 : 1}
      onClick={() => handleFollow()}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default NotificationItemLeft;
