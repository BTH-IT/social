import React, { useEffect, useState } from "react";
import Avatar from "../Avatar/Avatar";
import { StoryType } from "../StoryAvatarSlide/StoryAvatarSlide";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import storyApi from "../../api/storyApi";
import { authActions } from "../../redux/features/auth/authSlice";
import AvatarStory from "../Avatar/AvatarStory";
import { SERVER } from "../../utils/constant";
import { PostType, UserType } from "../Posts/Post";
import moment from "moment";
import NotificationItemLeft from "./NotificationItemLeft";
import { CommentType } from "../Posts/PostComment";

interface NotificationItemType {
  type: string;
  post: PostType;
  comment?: CommentType;
  userLiked: UserType;
  message: string;
  createdAt: string;
}

const NotificationItem = ({ notiInfo }: { notiInfo: NotificationItemType }) => {
  const [story, setStory] = useState<StoryType | null>(null);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchStory() {
      if (notiInfo.userLiked._id) {
        try {
          const { data: story } = await storyApi.getStoryByUserId(
            notiInfo.userLiked._id
          );
          setStory(story);
        } catch (error: any) {
          if (error.response.status === 401) {
            navigate("/login");
            dispatch(authActions.logout());
          }
        }
      }
    }

    fetchStory();
  }, [notiInfo]);

  return (
    <div className="notification-item">
      {story && story.stories?.length > 0 ? (
        <Link to={`/stories/${story._id}`} className="avatar-link">
          <AvatarStory
            story={story ? 1 : 0}
            href={`/${notiInfo.userLiked._id}`}
            style={{
              width: "44px",
              height: "44px",
            }}
            url={
              notiInfo.userLiked.profilePicture
                ? `${SERVER}files/${notiInfo.userLiked.profilePicture}`
                : "https://img.myloview.com/stickers/default-avatar-profile-image-vector-social-media-user-icon-400-228654854.jpg"
            }
          ></AvatarStory>
        </Link>
      ) : (
        <Avatar
          href={`/${notiInfo.userLiked._id}`}
          style={{
            width: "44px",
            height: "44px",
          }}
          url={
            notiInfo.userLiked.profilePicture
              ? `${SERVER}files/${notiInfo.userLiked.profilePicture}`
              : "https://img.myloview.com/stickers/default-avatar-profile-image-vector-social-media-user-icon-400-228654854.jpg"
          }
        ></Avatar>
      )}
      <div className="notification-item_content">
        <span className="notification-item_message">
          <a href={`/${notiInfo.userLiked._id}`}>
            <b>{notiInfo.userLiked.username}</b>
          </a>{" "}
          {notiInfo.message}
          {notiInfo.comment ? `: ${notiInfo.comment.content}` : "."}
        </span>
        <span className="notification-item_time">
          {moment(notiInfo.createdAt).fromNow()}
        </span>
      </div>
      <NotificationItemLeft
        type={notiInfo.type}
        post={notiInfo.post}
      ></NotificationItemLeft>
    </div>
  );
};

export default NotificationItem;
