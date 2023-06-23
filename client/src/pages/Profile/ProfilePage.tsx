import { ChangeEvent, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import chatApi from "../../api/chatApi";
import postApi from "../../api/postApi";
import uploadFile from "../../api/uploadFile";
import userApi from "../../api/userApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import { PostType, UserType } from "../../components/Posts/Post";
import { authActions } from "../../redux/features/auth/authSlice";
import { SERVER } from "../../utils/constant";
import { ChatType } from "../Messenger/Conversation";

const StyledProfilePage = styled.div`
  max-width: 935px;
  width: 100%;
  margin: 0 auto 30px;
  padding: 30px 20px 0 20px;
  background-color: #fafafa;
  .profile {
    &-top {
      display: flex;
      align-items: center;
      gap: 50px;
      margin-bottom: 44px;

      @media screen and (max-width: 786px) {
        gap: 25px;
        margin-bottom: 22px;
      }
    }

    &-image {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      cursor: pointer;
      flex-shrink: 0;

      @media screen and (max-width: 786px) {
        width: 100px;
        height: 100px;
      }

      @media screen and (max-width: 526px) {
        width: 75px;
        height: 75px;
      }
    }

    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }

    &-info {
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 2rem;
      flex: 1;
      @media screen and (max-width: 786px) {
        font-size: 1.6rem;
      }

      @media screen and (max-width: 526px) {
        font-size: 1.2rem;
      }

      &_container {
        display: flex;
        align-items: center;
        gap: 20px;

        @media screen and (max-width: 526px) {
          gap: 10px;
        }
      }
    }

    &-username {
      font-size: 3rem;
      font-weight: 300;
      @media screen and (max-width: 786px) {
        font-size: 2rem;
      }

      @media screen and (max-width: 526px) {
        font-size: 1.4rem;
      }
    }

    &-btn-edit {
      font-size: 1.6rem;
      @media screen and (max-width: 786px) {
        font-size: 1.2rem;
      }

      @media screen and (max-width: 526px) {
        font-size: 0.8rem;
      }
    }

    &-stats {
      display: flex;
      align-items: center;
      gap: 20px;

      @media screen and (max-width: 526px) {
        gap: 10px;
        font-size: 0.8rem;
      }
    }

    &-bottom {
      border-top: 1px solid rgb(219, 219, 219);
    }

    &-nav {
      display: flex;
      justify-content: center;
      gap: 20px;

      @media screen and (max-width: 526px) {
        gap: 10px;
      }

      &_item {
        padding: 20px;
        font-size: 1.4rem;
        text-transform: uppercase;
        font-weight: 500;
        display: flex;
        gap: 10px;
        border-top: 1px solid transparent;
        transition: all 0.1s linear;
        color: black;
        text-decoration: none;

        @media screen and (max-width: 526px) {
          padding: 10px;
          font-size: 1.2rem;
        }
      }

      &_item.active {
        border-color: black;
      }
    }

    &-btn {
      display: flex;
      align-items: center;
      gap: 10px;

      &-check {
        font-size: 1.6rem;
        padding: 4px 16px;
        border: 1px solid black;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }

  @media screen and (max-width: 786px) {
    margin-bottom: 90px;
    padding: 20px 10px 0 10px;
  }
`;

export const StyledChangePhoto = styled.div`
  background-color: white;
  border-radius: 6px;
  h2 {
    padding: 32px 32px 16px 32px;
    border-bottom: 1px solid rgb(219, 219, 219);
    font-size: 2rem;
  }

  div,
  label {
    padding: 20px 0;
    border-bottom: 1px solid rgb(219, 219, 219);
    font-size: 1.8rem;
    text-align: center;
    cursor: pointer;
    opacity: 0.8;
    display: block;
  }

  div:last-child {
    border: none;
  }

  .blue {
    color: #1d4ed8;
  }

  .red {
    color: #b91c1c;
  }
`;

const Following = ({ onClick }: { onClick: () => void }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser: UserType | null = JSON.parse(
    localStorage.getItem("current_user") || ""
  );

  const handleFollow = async () => {
    try {
      if (userId && currentUser) {
        await userApi.followUser(userId, currentUser._id);

        currentUser.followings.push(userId);
        localStorage.setItem("current_user", JSON.stringify(currentUser));
        window.location.reload();
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleMessage = async () => {
    try {
      if (currentUser && userId) {
        const { data } = await chatApi.userChats(currentUser._id);
        const hasChat = data.find((chat: ChatType) =>
          chat.members.includes(currentUser._id)
        );

        if (!hasChat) {
          await chatApi.createChat(currentUser._id, userId);
        }
        navigate("/inbox");
      }
    } catch (error) {
      console.log("error");
    }
  };

  if (userId && currentUser?.followings.includes(userId)) {
    return (
      <div className="profile-btn">
        <Button className="profile-btn-edit" onClick={handleMessage}>
          Message
        </Button>
        <i
          onClick={onClick}
          className="bi bi-person-check-fill profile-btn-check"
        ></i>
      </div>
    );
  } else {
    return (
      <Button className="profile-btn-edit" onClick={handleFollow}>
        Follow
      </Button>
    );
  }
};

const ProfilePage = () => {
  const { userId } = useParams();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [posts, setPosts] = useState<PostType[] | undefined>(undefined);
  const [showModalPhoto, setShowModalPhoto] = useState<boolean>(false);
  const [showModalCheck, setShowModalCheck] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (userId) {
          const resUser = await userApi.get(userId);
          const resPosts = await postApi.getYourTimeline(userId);
          setUser(resUser.data);
          setPosts(resPosts.data);
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          navigate("/");
        } else if (error.response.status === 401) {
          navigate("/login");
        }
      }
    }
    fetchProfile();
  }, [navigate, userId]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!currentUser) return;
    const file = (e.target.files as FileList)[0];
    const data = new FormData();
    const filename = Date.now() + file.name;
    data.append("name", filename);
    data.append("file", file);

    const newUpdateUser: UserType = {
      ...currentUser,
      profilePicture: filename,
    };

    try {
      if (currentUser?._id) {
        await userApi.update(currentUser?._id, newUpdateUser);
        await uploadFile(data);
        localStorage.setItem("current_user", JSON.stringify(newUpdateUser));
        window.location.reload();
        toast.success("Update successfully");
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        navigate("/login");
        dispatch(authActions.logout());
      } else if (error.response.status === 403) {
        toast.warning("Nothing change at all");
      } else toast.error("Update failure");
    }
  };

  return (
    <>
      <StyledProfilePage>
        <div className="profile-top">
          <div
            className="profile-image"
            onClick={() => setShowModalPhoto(true)}
          >
            <img
              src={
                user?.profilePicture
                  ? `${SERVER}files/${user?.profilePicture}`
                  : "https://img.myloview.com/stickers/default-avatar-profile-image-vector-social-media-user-icon-400-228654854.jpg"
              }
              alt=""
              className="profile-img"
            />
          </div>
          <div className="profile-info">
            <div className="profile-info_container">
              <span className="profile-username">{user?.username}</span>
              {currentUser?._id === user?._id ? (
                <Button
                  className="profile-btn-edit"
                  onClick={() => {
                    navigate("/accounts/edit");
                  }}
                >
                  Edit profile
                </Button>
              ) : (
                <Following onClick={() => setShowModalCheck(true)}></Following>
              )}
            </div>
            <div className="profile-stats">
              <div className="profile-posts">
                <b>{posts?.length}</b> posts
              </div>
              <div className="profile-followers">
                <b>{user?.followers?.length}</b> followers
              </div>
              <div className="profile-followings">
                <b>{user?.followings?.length}</b> followings
              </div>
            </div>
            <div className="profile-detail">
              <h5 className="profile-name">{user?.fullname}</h5>
              <div className="profile-desc">{user?.desc}</div>
            </div>
          </div>
        </div>
        <div className="profile-bottom">
          <div className="profile-nav">
            <NavLink
              end
              to={`/${user?._id}`}
              className={({ isActive }) =>
                isActive ? `profile-nav_item active` : `profile-nav_item`
              }
            >
              <i className="bi bi-grid-3x3"></i>
              Posts
            </NavLink>

            <NavLink
              end
              to={`/${user?._id}/saved`}
              className={({ isActive }) =>
                isActive ? `profile-nav_item active` : `profile-nav_item`
              }
            >
              <i className="bi bi-bookmark"></i>
              Saved
            </NavLink>

            <NavLink
              end
              to={`/${user?._id}/reels`}
              className={({ isActive }) =>
                isActive ? `profile-nav_item active` : `profile-nav_item`
              }
            >
              <i className="bi bi-collection-play"></i>
              Reels
            </NavLink>
          </div>
          <Outlet></Outlet>
        </div>
      </StyledProfilePage>
      <Modal
        overlay={true}
        onClose={() => setShowModalPhoto(false)}
        visible={showModalPhoto}
      >
        <StyledChangePhoto>
          <h2>Change Profile Photo</h2>
          <label className="blue" htmlFor="upload-photo">
            Upload Photo
          </label>
          <input type="file" hidden id="upload-photo" onChange={handleUpload} />
          <div className="red">Remove Current Photo</div>
          <div onClick={() => setShowModalPhoto(false)}>Cancel</div>
        </StyledChangePhoto>
      </Modal>

      <Modal
        overlay={true}
        onClose={() => setShowModalCheck(false)}
        visible={showModalCheck}
      >
        <StyledChangePhoto>
          <h2>Unfollow?</h2>
          <div
            onClick={async () => {
              const currentUserLocal: UserType | null = JSON.parse(
                localStorage.getItem("current_user") || ""
              );
              try {
                if (userId && currentUserLocal) {
                  await userApi.unFollowUser(userId, currentUserLocal._id);

                  const followingsIndex = currentUserLocal.followings.findIndex(
                    (id: string) => id === userId
                  );

                  if (followingsIndex !== -1) {
                    currentUserLocal.followings.splice(followingsIndex, 1);
                    localStorage.setItem(
                      "current_user",
                      JSON.stringify(currentUserLocal)
                    );
                    window.location.reload();
                  }
                }
              } catch (error) {}
            }}
          >
            Unfollow
          </div>
          <div onClick={() => setShowModalCheck(false)}>Cancel</div>
        </StyledChangePhoto>
      </Modal>
    </>
  );
};

export default ProfilePage;
