import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import deleteFile from "../../api/deleteFile";
import uploadFile from "../../api/uploadFile";
import userApi from "../../api/userApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Modal from "../../components/Modal/Modal";
import { UserType } from "../../components/Posts/Post";
import { authActions } from "../../redux/features/auth/authSlice";
import { SERVER } from "../../utils/constant";
import { StyledChangePhoto } from "../Profile/ProfilePage";

const StyledEditAccount = styled.div`
  max-width: 935px;
  width: 100%;
  height: 100vh;
  margin: 0 auto 30px;
  padding: 30px 20px 0 20px;
  background-color: #fafafa;

  @media screen and (max-width: 786px) {
    margin-bottom: 90px;
  }
  .edit {
    &-form {
      width: 100%;
      height: 100%;
      background-color: white;
      border: 1px solid rgb(219, 219, 219);
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      gap: 30px;
      padding: 0px 20px 30px 20px;
    }

    &-avatar {
      display: flex;
      gap: 20px;
      padding-top: 44px;
      align-items: center;

      &_name {
        font-size: 2.4rem;
      }
    }

    &-image {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      cursor: pointer;
    }

    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }

    &-name,
    &-username,
    &-bio,
    &-email {
      width: 100%;
      max-width: 500px;
      font-size: 2rem;
    }

    &-label {
      margin-bottom: 10px;
      display: block;
    }

    &-input {
      input {
        border: 1px solid rgb(219, 219, 219);
        transition: all 0.2s linear;

        &:focus {
          border-color: black;
        }
      }
    }

    &-textarea {
      resize: none;
      display: block;
      width: 100% !important;
      border: 1px solid rgb(219, 219, 219);
      outline: none;
      transition: all 0.2s linear;
      border-radius: 6px;
      font-size: 2rem;
      padding: 10px;

      &:focus {
        border-color: black;
      }
    }
  }
`;

const EditAccount = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [showModalPhoto, setShowModalPhoto] = useState<boolean>(false);
  const loginSuccess = useAppSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!loginSuccess) {
      navigate("/login", { replace: true });
    }
  }, [loginSuccess, navigate]);

  if (!loginSuccess) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const formArray = Array.from((e.target as HTMLFormElement).elements);
    const email =
      currentUser?.email !== (formArray[3] as HTMLInputElement).value &&
      (formArray[3] as HTMLInputElement).value
        ? (formArray[3] as HTMLInputElement).value
        : currentUser?.email;

    const username =
      currentUser?.username !== (formArray[1] as HTMLInputElement).value &&
      (formArray[1] as HTMLInputElement).value
        ? (formArray[1] as HTMLInputElement).value
        : currentUser?.username;

    const fullname =
      currentUser?.fullname !== (formArray[0] as HTMLInputElement).value &&
      (formArray[0] as HTMLInputElement).value
        ? (formArray[0] as HTMLInputElement).value
        : currentUser?.fullname;

    const desc =
      currentUser?.desc !== (formArray[2] as HTMLTextAreaElement).value
        ? (formArray[2] as HTMLTextAreaElement).value
        : currentUser.desc;

    const newUpdateUser: UserType = {
      ...currentUser,
      email,
      username,
      fullname,
      desc,
    };

    try {
      if (currentUser?._id) {
        await userApi.update(currentUser?._id, newUpdateUser);
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
      <StyledEditAccount>
        <form className="edit-form" onSubmit={handleSubmit}>
          <div className="edit-avatar">
            <div className="edit-image" onClick={() => setShowModalPhoto(true)}>
              <img
                src={
                  currentUser?.profilePicture ||
                  "https://img.myloview.com/stickers/default-avatar-profile-image-vector-social-media-user-icon-400-228654854.jpg"
                }
                alt=""
                className="edit-img"
              />
            </div>
            <div className="edit-avatar_name">{currentUser?.username}</div>
          </div>
          <div className="edit-name">
            <label htmlFor="fullname" className="edit-label">
              Fullname
            </label>
            <Input
              id="fullname"
              placeholder={`${currentUser?.fullname}`}
              className="edit-input"
            ></Input>
          </div>
          <div className="edit-username">
            <label htmlFor="username" className="edit-label">
              Username
            </label>
            <Input
              id="username"
              placeholder={`${currentUser?.username}`}
              className="edit-input"
            ></Input>
          </div>
          <div className="edit-bio">
            <label htmlFor="bio" className="edit-label">
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              className="edit-textarea"
              placeholder="Typing your bio..."
              defaultValue={currentUser?.desc}
            ></textarea>
          </div>
          <div className="edit-email">
            <label htmlFor="email" className="edit-label">
              Email
            </label>
            <Input
              id="email"
              placeholder={`${currentUser?.email}`}
              className="edit-input"
              type="email"
            ></Input>
          </div>
          <Button primary={1}>Submit</Button>
        </form>
      </StyledEditAccount>
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
          <div
            className="red"
            onClick={async () => {
              if (!currentUser?.profilePicture) return;

              const newUpdateUser: UserType = {
                ...currentUser,
                profilePicture: "",
              };

              try {
                await deleteFile(currentUser?.profilePicture);
                await userApi.update(currentUser._id, newUpdateUser);
                localStorage.setItem(
                  "current_user",
                  JSON.stringify(newUpdateUser)
                );
                window.location.reload();
                toast.success("Update successfully");
              } catch (error: any) {
                if (error.response.status === 401) {
                  navigate("/login");
                  dispatch(authActions.logout());
                } else if (error.response.status === 403) {
                  toast.warning("Nothing change at all");
                } else toast.error("Update failure");
              }
            }}
          >
            Remove Current Photo
          </div>
          <div onClick={() => setShowModalPhoto(false)}>Cancel</div>
        </StyledChangePhoto>
      </Modal>
    </>
  );
};

export default EditAccount;
