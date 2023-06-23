import { useEffect, useState } from "react";
import styled from "styled-components";
import Avatar from "../Avatar/Avatar";
import Modal from "../Modal/Modal";
import { PostType } from "./Post";
import PostFeature from "./PostFeature";
import userApi from "../../api/userApi";
import storyApi from "../../api/storyApi";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { authActions } from "../../redux/features/auth/authSlice";
import AvatarStory from "../Avatar/AvatarStory";
import { StoryType } from "../StoryAvatarSlide/StoryAvatarSlide";

const StyledNameLink = styled.a`
  text-decoration: none;
  color: black;

  :hover {
    color: gray;
    transition: all 0.15s ease;
  }
`;

const StyledPostHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;

  .post-heading-info {
    display: flex;
    align-items: center;
    gap: 10px;
    h6 {
      font-size: 1.4rem;
      font-weight: 500;
    }
  }

  i {
    font-size: 2rem;
    padding: 6px;
    cursor: pointer;
  }
`;

const PostHeading = ({
  username,
  avatar,
  post,
}: {
  username: string;
  avatar: string;
  post: PostType;
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [story, setStory] = useState<StoryType | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchUser() {
      if (username) {
        try {
          const { data: userId } = await userApi.getUserIdByUsername(username);
          const { data: story } = await storyApi.getStoryByUserId(userId);
          setStory(story);
        } catch (error: any) {
          if (error.response.status === 401) {
            navigate("/login");
            dispatch(authActions.logout());
          }
        }
      }
    }

    fetchUser();
  }, [username]);

  return (
    <>
      <StyledPostHeading>
        <div className="post-heading-info">
          {story ? (
            <Link to={`/stories/${story._id}`} className="avatar-link">
              <AvatarStory
                story={story ? 1 : 0}
                href={`/${post.userId}`}
                style={{
                  width: "44px",
                  height: "44px",
                }}
                url={avatar}
              ></AvatarStory>
            </Link>
          ) : (
            <Avatar
              href={`/${post.userId}`}
              style={{
                width: "44px",
                height: "44px",
              }}
              url={avatar}
            ></Avatar>
          )}
          <StyledNameLink href={`/${post.userId}`}>
            <h6>{username}</h6>
          </StyledNameLink>
        </div>
        <div onClick={() => setShow(true)}>
          <i className="bi bi-three-dots"></i>
        </div>
      </StyledPostHeading>
      <Modal visible={show} onClose={() => setShow(false)} overlay={true}>
        <PostFeature post={post} onClose={() => setShow(false)}></PostFeature>
      </Modal>
    </>
  );
};

export default PostHeading;
