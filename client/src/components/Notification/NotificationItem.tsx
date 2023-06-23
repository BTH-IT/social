import React, { useEffect, useState } from "react";
import Avatar from "../Avatar/Avatar";
import { StoryType } from "../StoryAvatarSlide/StoryAvatarSlide";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import storyApi from "../../api/storyApi";
import { authActions } from "../../redux/features/auth/authSlice";
import AvatarStory from "../Avatar/AvatarStory";
import { SERVER } from "../../utils/constant";
import Button from "../Button/Button";
import { UserType } from "../Posts/Post";
import userApi from "../../api/userApi";

const NotificationItem = ({
  userId,
  type,
}: {
  userId: string;
  type?: string;
}) => {
  const [story, setStory] = useState<StoryType | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchStory() {
      if (userId) {
        try {
          const { data: user } = await userApi.get(userId);
          const { data: story } = await storyApi.getStoryByUserId(userId);
          setUser(user);
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
  }, [userId]);

  return (
    <div className="notification-item">
      {story && story.stories?.length > 0 ? (
        <Link to={`/stories/${story._id}`} className="avatar-link">
          <AvatarStory
            story={story ? 1 : 0}
            href={`/${user?._id}`}
            style={{
              width: "44px",
              height: "44px",
            }}
            url={
              user?.profilePicture
                ? `${SERVER}files/${user?.profilePicture}`
                : "https://img.myloview.com/stickers/default-avatar-profile-image-vector-social-media-user-icon-400-228654854.jpg"
            }
          ></AvatarStory>
        </Link>
      ) : (
        <Avatar
          href={`/${user?._id}`}
          style={{
            width: "44px",
            height: "44px",
          }}
          url={
            user?.profilePicture
              ? `${SERVER}files/${user?.profilePicture}`
              : "https://img.myloview.com/stickers/default-avatar-profile-image-vector-social-media-user-icon-400-228654854.jpg"
          }
        ></Avatar>
      )}
      <div className="notification-item_content">
        <a href={`/${userId}`}>
          <b>{user?.username}</b>
        </a>{" "}
        started following you.{" "}
        <span className="notification-item_time">8w</span>
      </div>
      <Button className="notification-item_button" primary={1}>
        Follow
      </Button>
    </div>
  );
};

export default NotificationItem;
