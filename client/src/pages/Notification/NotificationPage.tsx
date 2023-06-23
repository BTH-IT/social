import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppSelector } from "../../app/hooks";
import Button from "../../components/Button/Button";

const StyledNoti = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 600px;
  background-color: #fafafa;
  margin: 10px auto;

  .notification-title {
    font-size: 2.4rem;
    padding: 16px 24px 24px;
    margin: 8px 0;
  }

  .notification-item {
    display: flex;
    align-items: center;
    padding: 8px 24px;

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

    &_content {
      flex: 1;
      font-size: 1.4rem;
    }

    &_button {
      margin-left: 10px;
    }
  }
`;

const NotificationPage = () => {
  const navigate = useNavigate();
  const loginSuccess = useAppSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!loginSuccess) {
      navigate("/login", { replace: true });
    }
  }, [loginSuccess]);

  if (!loginSuccess) {
    navigate("/login");
    return null;
  }

  return (
    <StyledNoti>
      <h4 className="notification-title">Notifications</h4>
      <div className="notification-container">
        <div className="notification-item">
          <div className="notification-item_image">
            <img
              src="https://images.unsplash.com/photo-1661961111184-11317b40adb2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxMXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
              alt=""
              className="notification-item_img"
            />
          </div>
          <div className="notification-item_content">
            <span>
              <b>bienthanhhung</b>
            </span>{" "}
            started following you.{" "}
            <span className="notification-item_time">8w</span>
          </div>
          <Button className="notification-item_button" primary={1}>
            Follow
          </Button>
        </div>
      </div>
    </StyledNoti>
  );
};

export default NotificationPage;
