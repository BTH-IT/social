import React, {
  ChangeEvent,
  FormEvent,
  useLayoutEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import postApi from "../../api/postApi";
import uploadFile from "../../api/uploadFile";
import userApi from "../../api/userApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { authActions } from "../../redux/features/auth/authSlice";
import { SERVER, customCreateStyle } from "../../utils/constant";
import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import { Mention, MentionsInput } from "react-mentions";
import mentionsStyles from "../../utils/mentionsStyles";
import { UserMentionType } from "../Posts/PostComment";
import { UserType } from "../Posts/Post";
import { useClickOutside } from "../../hooks/useClickOutside";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { AxiosResponse } from "axios";

const StyledCreate = styled.form`
  width: 50vw;
  max-height: 90vh;
  background-color: white;
  border-radius: 10px;
  overflow-y: auto;

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

      h2,
      span {
        font-size: 2rem;
      }

      a {
        text-decoration: none;
        color: black;
        font-weight: 500;
        transition: all 0.2s ease;

        &:hover {
          opacity: 0.7;
        }
      }
    }

    &_info {
      display: flex;
      flex-direction: column;
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
          bottom: calc(100% + 10px);
          right: -50%;
          transform: translateX(20%);
          z-index: 9999;

          em-emoji-picker {
            max-height: 200px;
          }
        }

        .emoji {
          color: #f7b928;
        }
      }
    }

    &_preview {
      max-height: 300px;
      overflow-y: auto;
      img,
      video {
        width: 100%;
        height: 300px;
        object-fit: cover;
      }
    }

    @media screen and (max-width: 526px) {
      padding: 10px;
      h2 {
        font-size: 1.6rem;
      }
    }
  }

  @media screen and (max-width: 526px) {
    width: 80vw;
  }

  @media screen and (max-width: 300px) {
    .emoji-popup {
      em-emoji-picker {
        max-width: 250px;
        max-height: 200px;
      }
    }
  }
`;

const StyledTagUser = styled.div`
  background-color: white;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  h1 {
    padding: 16px 16px 0 16px;
  }

  ul {
    margin: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 2rem;
    max-height: 300px;
    overflow-y: auto;
    padding-bottom: 16px;

    li {
      cursor: pointer;
      padding: 8px 16px;
      transition: all 0.2s ease;

      &:hover {
        background-color: #f5f5f4;
      }
    }
  }
`;

export interface CreateType {
  userId?: string;
  desc: string;
  fileUploads?: AxiosResponse<any, any>;
}

export interface FileUrlType {
  type: string;
  url: string;
}

export interface FileUploadsType {
  id: string;
  url: string;
  type: string;
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
  const [disabledButton, setDisabledButton] = useState<boolean>(false);
  const [fileUploadList, setFileUploadList] = useState<FormData | null>(null);
  const [fileUrlList, setFileUrlList] = useState<FileUrlType[]>([]);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [userList, setUserList] = useState<UserMentionType[] | []>([]);
  const [emoji, setEmoji] = useState<string>("");
  const { show, setShow, elementRef } = useClickOutside();
  const [emojiValue, setEmojiValue] = useState([]);
  const [showTagUser, setShowTagUser] = useState<boolean>(false);
  const [tagUser, setTagUser] = useState<string[]>([]);
  const queryEmojis = (query: any, callback: any) => {
    if (query.length === 0) return;
    const filterValue = emojiValue
      .filter((emoji: any) => {
        return emoji.name.indexOf(query.toLowerCase()) > -1;
      })
      .slice(0, 10);
    return filterValue.map(({ emoji }: any) => ({ id: emoji }));
  };
  const notMatchingRegex = /($a)/;

  useLayoutEffect(() => {
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

  useLayoutEffect(() => {
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

  function changeMultipleFiles(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length <= 5) {
      const data = new FormData();
      Array.from(e.target.files).forEach((file) => {
        data.append("file", file);
        fileUrlList.push({
          type: file.type.split("/")[0],
          url: URL.createObjectURL(file),
        });
      });

      setFileUploadList(data);
      setFileUrlList([...fileUrlList]);
    } else {
      toast.warning(
        "Please make sure that you can upload less than or equal to 5 files"
      );
    }
  }

  function reset() {
    setText("");
    setFileUploadList(null);
    setFileUrlList([]);
  }

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !text ||
      !currentUser?._id ||
      !fileUploadList ||
      !fileUploadList.has("file")
    ) {
      toast.error("Please make sure that you have entered all the fields");
      return;
    }

    setDisabledButton(true);
    try {
      const { data: fileUploads } = await uploadFile(fileUploadList);

      const post = {
        userId: currentUser._id,
        desc: text,
        fileUploads,
        feeling: emoji,
        tagUser,
      };

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
    } finally {
      setDisabledButton(false);
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

  return (
    <>
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
                  currentUser?.profilePicture?.url ||
                  "https://res.cloudinary.com/dt4pt2kyl/image/upload/v1687772432/social/qvcog6uqkqfjnp7h5vo2.jpg"
                }
              ></Avatar>
              <div className="create-post_info">
                <h2>{currentUser?.username}</h2>
                <span>{emoji ? `is feeling ${emoji}` : ""}</span>
                {tagUser.length > 0 ? (
                  <span>
                    with{" "}
                    {tagUser.map((usr, idx) => {
                      if (idx === 0) {
                        return (
                          <span>
                            <a href={`/${usr}`}>{usr}</a>
                          </span>
                        );
                      }

                      return (
                        <span>
                          ,<a href={`/${usr}`}>{usr}</a>
                        </span>
                      );
                    })}
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="create-post_textarea">
              <MentionsInput
                style={customCreateStyle}
                value={text || ""}
                name="desc"
                onChange={(e) => setText(e.target.value)}
                placeholder={`What's on your mind, ${currentUser?.fullname}?`}
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
            <div className="create-post_preview">{render()}</div>
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
                <label
                  htmlFor="tag-people"
                  className="tag-people"
                  onClick={() => setShowTagUser(true)}
                >
                  <i className="bi bi-person-plus-fill"></i>
                </label>
              </div>
              <div className="create-post_add-post-item" ref={elementRef}>
                {show && (
                  <div className="emoji-popup">
                    <Picker
                      data={data}
                      onEmojiSelect={(e: any) => {
                        if (e.native === emoji) {
                          setEmoji("");
                        } else {
                          setEmoji(`${e.native}`);
                        }
                        setShow(!show);
                      }}
                      emojiSize={20}
                      emojiButtonSize={28}
                      maxFrequentRows={0}
                      previewPosition="none"
                      theme="light"
                      icons={"solid"}
                    />
                  </div>
                )}
                <label
                  htmlFor="emoji"
                  className="emoji"
                  onClick={() => setShow(!show)}
                >
                  <i className="bi bi-emoji-smile-fill"></i>
                </label>
              </div>
            </div>
            <Button primary={1} disabled={disabledButton}>
              Post
            </Button>
          </div>
        </StyledCreate>
      </Modal>
      <Modal
        visible={showTagUser}
        onClose={() => setShowTagUser(!showTagUser)}
        overlay={true}
        hasIconClose={true}
      >
        <StyledTagUser>
          <h1>Tag user</h1>
          <ul>
            {userList.length > 0 &&
              userList.map((user) => {
                if (user.display !== currentUser?.username) {
                  return (
                    <li
                      key={user.display}
                      onClick={() => {
                        setShowTagUser(false);
                        setTagUser(() => {
                          if (
                            !Boolean(
                              tagUser.find((usr) => user.display === usr)
                            )
                          ) {
                            return [...tagUser, user.display];
                          }
                          return tagUser.filter((usr) => usr !== user.display);
                        });
                      }}
                    >
                      {user.display}
                    </li>
                  );
                }
              })}
          </ul>
        </StyledTagUser>
      </Modal>
    </>
  );
};

export default Create;
