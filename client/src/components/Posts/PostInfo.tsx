import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PostModal from "./PostModal";
import moment from "moment";
import postApi from "../../api/postApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostType } from "./Post";
import { authActions } from "../../redux/features/auth/authSlice";
import { SOCKET_SERVER } from "../../utils/constant";
import notiApi from "../../api/notiApi";

const StyledPostInteractive = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 12px 6px;
  margin: 4px 0 0;

  i {
    font-size: 22px;
    padding: 8px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  i.fill {
    &:hover {
      opacity: 1;
    }
  }

  i.bi-heart-fill {
    color: #ed4956;
  }

  .post-save {
    margin-right: -8px;
  }
`;

const StyledReact = styled.div`
  display: flex;
  align-items: center;
  margin-left: -8px;
`;

const StyledLikes = styled.div`
  margin: 0 0 8px;
  padding: 0 12px;
  font-size: 1.4rem;
  font-weight: 500;
`;

const StyledTime = styled.div`
  padding: 0 12px;
  font-size: 1rem;
  color: #8e8e8e;
  margin-bottom: 8px;
`;

const PostInfo = ({
  children,
  hasModal,
  post,
}: {
  children?: React.ReactNode;
  hasModal?: true | false;
  post: PostType;
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [heart, setHeart] = useState<boolean>(
    Boolean(post.likes.find((like: string) => like === currentUser?._id))
  );
  const [save, setSave] = useState<boolean>(
    Boolean(post.saved.find((save: string) => save === currentUser?._id))
  );
  const [show, setShow] = useState<boolean>(false);
  const [numLikes, setNumLikes] = useState<number>(post.likes?.length);

  useEffect(() => {
    if (SOCKET_SERVER && currentUser) {
      SOCKET_SERVER.on("liked-post", (post) => {
        setNumLikes(post.likes?.length);
        setHeart(
          Boolean(post.likes.find((like: string) => like === currentUser?._id))
        );
      });

      SOCKET_SERVER.on("saved-post", (post) => {
        setSave(
          Boolean(post.saved.find((save: string) => save === currentUser?._id))
        );
      });
    }
  }, [currentUser]);

  const handleHeartPost = async () => {
    try {
      if (currentUser) {
        if (post._id) {
          await postApi.likePost(post._id, currentUser._id);
        }

        if (heart) {
          post.likes?.splice(
            post.likes?.findIndex((like) => like === currentUser?._id),
            1
          );
        } else {
          post.likes?.push(currentUser._id);
        }
        setHeart(!heart);
        setNumLikes(post.likes?.length);
        let notification = null;
        if (heart) {
          notification = {
            type: "like-post",
            post,
            userLiked: currentUser,
            message: "liked your post",
            createdAt: new Date(),
          };
          await notiApi.addNotificationByUserId(notification, post.userId);
        }
        SOCKET_SERVER?.emit("noti-like-post", post, notification);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        navigate("/login");
        dispatch(authActions.logout());
      }
    }
  };

  const handleSavePost = async () => {
    try {
      if (currentUser) {
        if (post._id) {
          await postApi.savePost(post._id, currentUser._id);
        }

        if (save) {
          post.saved?.splice(
            post.saved?.findIndex((save) => save === currentUser?._id),
            1
          );
        } else {
          post.saved?.push(currentUser._id);
        }
        setSave(!save);
        SOCKET_SERVER?.emit("save-post", post);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        navigate("/login");
        dispatch(authActions.logout());
      }
    }
  };

  if (post.fileUploads.length <= 0) {
    return (
      <>
        <div
          style={{
            marginTop: "10px",
          }}
        >
          {children}
        </div>
        <StyledPostInteractive>
          <StyledReact>
            <div onClick={handleHeartPost}>
              {heart ? (
                <i className="bi bi-heart-fill fill"></i>
              ) : (
                <i className="bi bi-heart"></i>
              )}
            </div>

            {document.body.clientWidth <= 1024 ? (
              <i
                className="bi bi-chat"
                style={{
                  transform: "scaleX(-1)",
                  display: "inline-block",
                }}
                onClick={() => {
                  navigate(`/p/${post._id}`);
                }}
              ></i>
            ) : (
              <i
                className="bi bi-chat"
                style={{
                  transform: "scaleX(-1)",
                  display: "inline-block",
                }}
                onClick={() => {
                  setShow(true);
                  document.body.classList.add("stop-scrolling");
                }}
              ></i>
            )}
          </StyledReact>
          <div className="post-save" onClick={handleSavePost}>
            {save ? (
              <i className="bi bi-bookmark-fill fill"></i>
            ) : (
              <i className="bi bi-bookmark"></i>
            )}
          </div>
        </StyledPostInteractive>
        <StyledLikes>{numLikes} likes</StyledLikes>

        <StyledTime>{moment(post.createdAt).fromNow()}</StyledTime>
        {hasModal ? (
          <PostModal
            post={post}
            show={show}
            onClose={() => {
              setShow(false);
              document.body.classList.remove("stop-scrolling");
            }}
          ></PostModal>
        ) : null}
      </>
    );
  }

  return (
    <>
      <StyledPostInteractive>
        <StyledReact>
          <div onClick={handleHeartPost}>
            {heart ? (
              <i className="bi bi-heart-fill fill"></i>
            ) : (
              <i className="bi bi-heart"></i>
            )}
          </div>

          {document.body.clientWidth <= 1024 ? (
            <i
              className="bi bi-chat"
              style={{
                transform: "scaleX(-1)",
                display: "inline-block",
              }}
              onClick={() => {
                navigate(`/p/${post._id}`);
              }}
            ></i>
          ) : (
            <i
              className="bi bi-chat"
              style={{
                transform: "scaleX(-1)",
                display: "inline-block",
              }}
              onClick={() => {
                setShow(true);
                document.body.classList.add("stop-scrolling");
              }}
            ></i>
          )}
        </StyledReact>
        <div className="post-save" onClick={handleSavePost}>
          {save ? (
            <i className="bi bi-bookmark-fill fill"></i>
          ) : (
            <i className="bi bi-bookmark"></i>
          )}
        </div>
      </StyledPostInteractive>
      <StyledLikes>{post.likes?.length} likes</StyledLikes>
      {children}
      <StyledTime>{moment(post.createdAt).fromNow()}</StyledTime>
      {hasModal ? (
        <PostModal
          post={post}
          show={show}
          onClose={() => {
            setShow(false);
            document.body.classList.remove("stop-scrolling");
          }}
        ></PostModal>
      ) : null}
    </>
  );
};

export default PostInfo;
