import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../api/userApi";
import { useAppDispatch } from "../../app/hooks";
import Avatar from "../../components/Avatar/Avatar";
import { UserType } from "../../components/Posts/Post";
import { authActions } from "../../redux/features/auth/authSlice";
import { SERVER } from "../../utils/constant";

export interface ChatType {
  _id: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Conversation = ({
  data,
  currentUserId,
  onClick,
  online,
}: {
  data: ChatType;
  currentUserId: string | undefined;
  onClick: () => void;
  online: boolean;
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [otherUser, setOtherUser] = useState<UserType | null>(null);

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUserId);
    async function fetchUser() {
      try {
        if (userId) {
          const { data } = await userApi.get(userId);
          setOtherUser(data);
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/login");
          dispatch(authActions.logout());
        }
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="messenger-left-contact_container" onClick={onClick}>
      <Avatar
        style={{
          width: "56px",
          height: "56px",
        }}
        url={
          otherUser?.profilePicture
            ? `${SERVER}files/${otherUser?.profilePicture}`
            : "https://img.myloview.com/stickers/default-avatar-profile-image-vector-social-media-user-icon-400-228654854.jpg"
        }
      ></Avatar>
      <div className="messenger-left-contact_info">
        <div className="messenger-left-contact_name">{otherUser?.username}</div>
        <div className="messenger-left-contact_status">
          {online ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
