import React, {
  ChangeEvent,
  FormEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import postApi from "../../api/postApi";
import uploadFile from "../../api/uploadFile";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { authActions } from "../../redux/features/auth/authSlice";
import { SERVER } from "../../utils/constant";
import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";

const StyledCreate = styled.form`
  width: 50vw;
  max-height: 90vh;
  overflow-y: auto;
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
        font-size: 1.8rem;
        width: 100%;
        height: 35px;
        max-height: 50vh;
        resize: none;
        outline: none;
        border: none;
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
  const textareaRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const [fileNameUploadList, setFileNameUploadList] = useState<FileNameType[]>(
    []
  );
  const [fileUploadList, setFileUploadList] = useState<FormData[]>([]);
  const [fileUrlList, setFileUrlList] = useState<FileUrlType[]>([]);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  useLayoutEffect(() => {
    setTextareaHeight(`${textareaRef?.current?.scrollHeight}px`);
  }, [text]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setTextareaHeight("auto");
    setText(e.target.value);
  }

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
            <textarea
              ref={textareaRef}
              name="desc"
              value={text}
              placeholder={`What's on your mind, ${currentUser?.fullname}?`}
              onChange={handleChange}
              style={{
                height: textareaHeight,
              }}
            ></textarea>
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
            <div className="create-post_add-post-item">
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
