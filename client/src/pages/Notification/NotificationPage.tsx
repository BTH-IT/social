import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../components/Button/Button";
import NotificationItem from "../../components/Notification/NotificationItem";
import { SOCKET_SERVER } from "../../App";
import notiApi from "../../api/notiApi";
import { authActions } from "../../redux/features/auth/authSlice";

const StyledNoti = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 600px;
  background-color: #fafafa;
  margin: 10px auto;

  .notification-container {
    flex: 1;
    overflow-y: auto;
  }

  .notification-title {
    font-size: 2.4rem;
    padding: 16px 24px 24px;
    margin: 8px 0;
  }

  .notification-item {
    display: flex;
    align-items: center;
    padding: 8px 24px;
    gap: 10px;
    transition: all 0.2s ease;

    &_image {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      margin-right: 10px;
    }

    &_img {
      border-radius: inherit;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &_message {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* number of lines to show */
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &_content {
      flex: 1;
      font-size: 1.4rem;
      a {
        text-decoration: none;
        color: black;
        transition: all 0.2s ease;
        &:hover {
          opacity: 0.7;
        }
      }
    }

    &:hover {
      background-color: #f4f4f5;
    }
  }
`;

const NotificationPage = () => {
  const loginSuccess = useAppSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [notifications, setNotifications] = useState<any[] | []>([]);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  useEffect(() => {
    if (!loginSuccess) {
      navigate("/login", { replace: true });
    }
  }, [loginSuccess]);

  useEffect(() => {
    if (SOCKET_SERVER) {
      SOCKET_SERVER.on("noti", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });
    }
  }, []);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        if (currentUser) {
          const { data: notiList } = await notiApi.getNotificationByUserId(
            currentUser._id
          );

          setNotifications(notiList.notifications);
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/login");
          dispatch(authActions.logout());
        }
      }
    }

    fetchNotifications();
  }, [currentUser]);

  return (
    <StyledNoti>
      <h4 className="notification-title">Notifications</h4>
      <div className="notification-container">
        {notifications?.length > 0 &&
          notifications.map((notiInfo, index) => (
            <NotificationItem
              key={index}
              notiInfo={notiInfo}
            ></NotificationItem>
          ))}
      </div>
    </StyledNoti>
  );
};

export default NotificationPage;
