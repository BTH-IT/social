import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import uploadFile from "../../api/uploadFile";
import { authActions } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import storyApi from "../../api/storyApi";
import { FileNameType } from "../Create/Create";
import userApi from "../../api/userApi";
import { UserType } from "../Posts/Post";
import { SERVER } from "../../utils/constant";
import AvatarStory from "../Avatar/AvatarStory";

const StyledCreateStory = styled.label`
  display: block;
  text-align: center;
  cursor: pointer;

  i {
    font-size: 4.1rem;

    @media screen and (max-width: 526px) {
      font-size: 3.2rem;
    }
  }
`;

const StyledForm = styled.form`
  width: 50vw;
  background-color: white;
  border-radius: 6px;
  padding: 20px;

  .btn-story {
    width: 100%;
  }
`;

export interface StoryType {
  _id: string;
  userId: string;
  stories: FileNameType[];
  createdAt: string;
  updatedAt: string;
}

export const StoryAvatarInfo = ({
  story,
  style,
}: {
  story: StoryType;
  style?: React.CSSProperties;
}) => {
  const [user, setUser] = useState<UserType>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchUser() {
      if (story.userId) {
        try {
          const res = await userApi.get(story.userId);
          setUser(res.data);
        } catch (error: any) {
          if (error.response.status === 401) {
            navigate("/login");
            dispatch(authActions.logout());
          }
        }
      }
    }
    fetchUser();
  }, [dispatch, navigate, story.userId]);

  return (
    <>
      <AvatarStory
        style={style}
        story={1}
        url={
          user?.profilePicture
            ? `${SERVER}files/${user?.profilePicture}`
            : "https://img.myloview.com/stickers/default-avatar-profile-image-vector-social-media-user-icon-400-228654854.jpg"
        }
      ></AvatarStory>
      <span className="story-name">{user?.username}</span>
    </>
  );
};

const StoryAvatarSlide = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileUpload, setFileUpload] = useState<FormData[]>([]);
  const [fileNameUpload, setFileNameUpload] = useState<FileNameType[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [stories, setStories] = useState<StoryType[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFileUpload = Array.from(e.target.files).map((file) => {
        const data = new FormData();
        const filename = Date.now() + file.name;
        data.append("name", filename);
        data.append("file", file);
        fileNameUpload.push({
          type: file.type.split("/")[0],
          filename,
        });
        return data;
      });
      setFileUpload(newFileUpload);
      setFileNameUpload(fileNameUpload);
      setShowModal(true);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (!currentUser?._id) return;

    const story = {
      userId: currentUser._id,
      stories: fileNameUpload,
    };

    fileUpload.forEach(async (data) => {
      try {
        await uploadFile(data);
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/login");
          dispatch(authActions.logout());
        }
      }
    });

    try {
      await storyApi.createStory(story);
      setShowModal(false);
      toast.success("Create your story successfully");
    } catch (error: any) {
      if (error.response.status === 401) {
        navigate("/login");
        dispatch(authActions.logout());
      } else {
        toast.error("There is something wrong here");
      }
    }
  };

  useEffect(() => {
    async function fetchStories() {
      try {
        if (currentUser) {
          const { data } = await storyApi.getTimelineStory(currentUser._id);

          const stories = data.filter(
            (story: StoryType) => story.stories.length > 0
          );

          setStories(stories);
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/login");
          dispatch(authActions.logout());
        }
      }
    }

    fetchStories();
  }, [currentUser, dispatch, navigate]);

  const render = () => {
    return stories.map((story) => {
      return (
        <SwiperSlide key={story._id}>
          <Link to={`/stories/${story._id}`} className="avatar-link">
            <StoryAvatarInfo story={story}></StoryAvatarInfo>
          </Link>
        </SwiperSlide>
      );
    });
  };

  return (
    <>
      <Swiper
        spaceBetween={1}
        slidesPerView={4}
        navigation
        modules={[Navigation]}
        allowTouchMove={false}
      >
        <SwiperSlide>
          <StyledCreateStory htmlFor="create-story">
            <i className="bi bi-plus-circle-dotted"></i>
            <span className="story-name">Create Story</span>
          </StyledCreateStory>
          <input
            ref={inputRef}
            type="file"
            hidden
            id="create-story"
            multiple
            onChange={handleChange}
          />
        </SwiperSlide>
        {render()}
      </Swiper>
      <Modal
        onClose={() => {
          if (inputRef.current) {
            inputRef.current.value = "";
          }
          setShowModal(false);
        }}
        visible={showModal}
        overlay={true}
        hasIconClose={true}
      >
        <StyledForm
          action="/upload"
          encType="multipart/form-data"
          method="POST"
          onSubmit={handleSubmit}
        >
          <Button primary={1} className="btn-story">
            Create your story
          </Button>
        </StyledForm>
      </Modal>
    </>
  );
};

export default StoryAvatarSlide;
