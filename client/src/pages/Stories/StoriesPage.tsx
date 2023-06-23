import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import storyApi from "../../api/storyApi";
import userApi from "../../api/userApi";
import { useAppDispatch } from "../../app/hooks";
import StorySlide, {
  StoriesType,
} from "../../components/StorySlide/StorySlide";
import { authActions } from "../../redux/features/auth/authSlice";
import { SERVER } from "../../utils/constant";
import { history } from "../../utils/history";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
const StyledStoriesPage = styled.div`
  background-color: #1a1a1a;
  width: 100vw;
  height: 100vh;
  position: relative;

  .story {
    &-logo {
      position: absolute;
      top: 10px;
      left: 20px;
      font-size: 3rem;
      color: white;
      text-decoration: none;
    }

    &-close {
      position: absolute;
      top: 10px;
      right: 20px;
      font-size: 3rem;
      color: white;
      cursor: pointer;
    }
  }
`;

const StoriesPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { storyId } = useParams();
  const [stories, setStories] = useState<StoriesType[]>([]);
  useEffect(() => {
    async function fetchStories() {
      try {
        if (storyId) {
          const resStory = await storyApi.getStory(storyId);
          const resUser = await userApi.get(resStory.data.userId);
          const user = resUser.data;
          const stories = resStory.data.stories;

          const storyArray = stories.map(
            (story: {
              filenameUploads: {
                type: string;
                filename: string;
              };
              createdAt: string;
            }) => {
              return {
                url: `${SERVER}files/${story.filenameUploads.filename}`,
                type: story.filenameUploads.type,
                header: {
                  heading: user?.username,
                  subheading: user?.fullname,
                  profileImage: user?.profilePicture
                    ? `${SERVER}files/${user?.profilePicture}`
                    : "https://img.myloview.com/stickers/default-avatar-profile-image-vector-social-media-user-icon-400-228654854.jpg",
                },
                duration:
                  story.filenameUploads.type === "image" ? 10000 : undefined,
              };
            }
          );

          setStories(storyArray);
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/login");
          dispatch(authActions.logout());
        }
      }
    }

    fetchStories();
  }, [dispatch, navigate, storyId]);

  return (
    <StyledStoriesPage>
      <Link to="/" className="story-logo">
        𝘽𝙏𝙃 𝙎𝙤𝙘𝙞𝙖𝙡
      </Link>
      <div className="story-close" onClick={() => history.back()}>
        <i className="bi bi-x-lg"></i>
      </div>
      {stories.length > 0 && <StorySlide stories={stories}></StorySlide>}
    </StyledStoriesPage>
  );
};

export default StoriesPage;
