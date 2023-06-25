import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import postApi from "../../api/postApi";
import uploadFile from "../../api/uploadFile";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { authActions } from "../../redux/features/auth/authSlice";
import { SERVER, customCreateStyle } from "../../utils/constant";
import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import { Mention, MentionsInput } from "react-mentions";
import mentionsStyles from "../../utils/mentionsStyles";
import userApi from "../../api/userApi";
import { UserType } from "../Posts/Post";
import { UserMentionType } from "../Posts/PostComment";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const StyledCreate = styled.form`
  width: 50vw;
  max-height: 90vh;
  background-color: white;
  border-radius: 10px;

  .create-heading {
    font-size: 2.4rem;
    text-align: center;
    padding: 12px 0;
    border-bottom: 1px solid rgb(219, 219, 219);
  }

  .create-post {
    padding: 24px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;

    &_heading {
      display: flex;
      align-items: center;
      gap: 10px;

      h2 {
        font-size: 2rem;
      }
    }

    &_textarea {
      width: 100%;

      textarea {
        font-size: 1.8rem !important;
        width: 100%;
        height: 35px;
        resize: none;
        outline: none;
        border: none;
        padding: 0 !important;
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }

    &_add-post {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px;
      border: 1px solid rgb(219, 219, 219);
      border-radius: 4px;

      &-item {
        position: relative;
        label {
          font-size: 2rem;
          cursor: pointer;
        }

        .images {
          color: #45bd62;
        }

        .tag-people {
          color: #1877f2;
        }

        .emoji-popup {
          position: absolute;
          bottom: 100%;
          right: calc(100% + 10px);
          transform: translateY(50%);
          z-index: 9999;

          &.d-none {
            display: none;
          }
        }

        .emoji {
          color: #f7b928;
        }
      }
    }
  }

  @media screen and (max-width: 526px) {
    width: 80vw;
  }
`;

export interface CreateType {
  userId?: string;
  desc: string;
  fileUploads?: FileNameType[];
}

export interface FileUrlType {
  type: string;
  url: string;
}

export interface FileNameType {
  type: string;
  filename: string;
}

const Create = ({
  create,
  onClose,
}: {
  create: boolean;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [fileNameUploadList, setFileNameUploadList] = useState<FileNameType[]>(
    []
  );
  const [fileUploadList, setFileUploadList] = useState<FormData[]>([]);
  const [fileUrlList, setFileUrlList] = useState<FileUrlType[]>([]);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [userList, setUserList] = useState<UserMentionType[] | []>([]);
  const [showEmoji, setShowEmoji] = useState<Boolean>(false);

  useEffect(() => {
    try {
      async function fetchUser() {
        const { data } = await userApi.getAll();

        const userMentionList = data.map((user: UserType): UserMentionType => {
          return {
            id: user.fullname,
            display: user.username,
          };
        });

        setUserList(userMentionList);
      }

      fetchUser();
    } catch (error: any) {
      if (error.response.status === 401) {
        navigate("/login");
        dispatch(authActions.logout());
      }
    }
  }, []);

  function changeMultipleFiles(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => {
        const data = new FormData();
        const filename = Date.now() + file.name;
        data.append("name", filename);
        data.append("file", file);
        fileNameUploadList.push({
          type: file.type.split("/")[0],
          filename,
        });
        fileUploadList.push(data);
        fileUrlList.push({
          type: file.type.split("/")[0],
          url: URL.createObjectURL(file),
        });
      });

      setFileNameUploadList([...fileNameUploadList]);
      setFileUploadList([...fileUploadList]);
      setFileUrlList([...fileUrlList]);
    }
  }

  function reset() {
    setText("");
    setFileNameUploadList([]);
    setFileUploadList([]);
    setFileUrlList([]);
  }

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text || !currentUser?._id) return;

    const post = {
      userId: currentUser._id,
      desc: text,
      fileUploads: fileNameUploadList,
    };

    fileUploadList.forEach(async (data) => {
      try {
        await uploadFile(data);
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/login");
          dispatch(authActions.logout());
        } else {
          toast.error("There is something wrong here");
        }
      }
    });

    try {
      await postApi.createPost(post);
      onClose();
      reset();
      toast.success("Create a post successfully");
    } catch (error: any) {
      if (error.response.status === 401) {
        navigate("/login");
        dispatch(authActions.logout());
      } else {
        toast.error("There is something wrong here");
      }
    }
  };

  const render = () => {
    return fileUrlList.map((file: FileUrlType) => {
      if (file.type === "image") {
        return <img className="image" src={file.url} alt="" key={file.url} />;
      }

      if (file.type === "video") {
        return (
          <video
            id="video-container"
            controls
            src={file.url}
            key={file.url}
          ></video>
        );
      }

      return null;
    });
  };

  const [emojiValue, setEmojiValue] = useState([]);
  const notMatchingRegex = /($a)/;

  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/oliveratgithub/0bf11a9aff0d6da7b46f1490f86a71eb/raw/d8e4b78cfe66862cf3809443c1dba017f37b61db/emojis.json"
    )
      .then((data) => {
        return data.json();
      })
      .then((jsonData) => {
        setEmojiValue(jsonData.emojis);
      });
  }, []);
  const queryEmojis = (query: any, callback: any) => {
    if (query.length === 0) return;
    const filterValue = emojiValue
      .filter((emoji: any) => {
        return emoji.name.indexOf(query.toLowerCase()) > -1;
      })
      .slice(0, 10);
    return filterValue.map(({ emoji }: any) => ({ id: emoji }));
  };

  return (
    <Modal
      visible={create}
      onClose={onClose}
      overlay={true}
      hasIconClose={true}
    >
      <StyledCreate
        onSubmit={(e: FormEvent<HTMLFormElement>) => handleCreate(e)}
        action="/upload"
        encType="multipart/form-data"
        method="POST"
      >
        <h2 className="create-heading">Create new post</h2>
        <div className="create-post">
          <div className="create-post_heading">
            <Avatar
              style={{
                width: "44px",
                height: "44px",
              }}
              url={
                currentUser?.profilePicture
                  ? `${SERVER}files/${currentUser?.profilePicture}`
                  : "https://img.myloview.com/stickers/default-avatar-profile-image-vector-social-media-user-icon-400-228654854.jpg"
              }
            ></Avatar>
            <h2>{currentUser?.username}</h2>
          </div>
          <div className="create-post_textarea">
            <MentionsInput
              style={customCreateStyle}
              value={text || ""}
              name="desc"
              onChange={(e) => setText(e.target.value)}
              placeholder={`What's on your mind, ${currentUser?.fullname}?`}
              allowSuggestionsAboveCursor={true}
            >
              <Mention
                displayTransform={(id) => `@${id}`}
                trigger="@"
                style={mentionsStyles}
                data={userList}
              />
              <Mention
                trigger=":"
                markup="__id__"
                regex={notMatchingRegex}
                data={queryEmojis}
              />
            </MentionsInput>
          </div>
          {render()}
          <div className="create-post_add-post">
            <div className="create-post_add-post-item">
              <label htmlFor="images" className="images">
                <i className="bi bi-images"></i>
              </label>
              <input
                type="file"
                hidden
                id="images"
                multiple
                onChange={changeMultipleFiles}
                accept="video/*,image/*"
              />
            </div>
            <div className="create-post_add-post-item">
              <label htmlFor="tag-people" className="tag-people">
                <i className="bi bi-person-plus-fill"></i>
              </label>
            </div>
            <div
              className="create-post_add-post-item"
              onClick={() => setShowEmoji(!showEmoji)}
            >
              <div className={`emoji-popup ${showEmoji ? "" : "d-none"}`}>
                <Picker
                  data={data}
                  theme={"light"}
                  onEmojiSelect={console.log}
                  previewPosition="none"
                />
              </div>
              <label htmlFor="emoji" className="emoji">
                <i className="bi bi-emoji-smile-fill"></i>
              </label>
            </div>
          </div>
          <Button primary={1}>Post</Button>
        </div>
      </StyledCreate>
    </Modal>
  );
};

export default Create;
