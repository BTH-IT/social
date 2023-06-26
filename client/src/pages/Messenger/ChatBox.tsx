import { debounce } from "debounce";
import moment from "moment";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import chatApi from "../../api/chatApi";
import userApi from "../../api/userApi";
import { useAppDispatch } from "../../app/hooks";
import Avatar from "../../components/Avatar/Avatar";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { UserType } from "../../components/Posts/Post";
import { authActions } from "../../redux/features/auth/authSlice";
import { ChatType } from "./Conversation";
import { v4 as uuidv4 } from "uuid";
import { SERVER } from "../../utils/constant";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { toast } from "react-toastify";

interface MessageType {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MessageSendType {
  chatId: string | undefined;
  senderId: string | undefined;
  text: string;
}

const ChatBox = ({
  chat,
  currentUserId,
  setSendMessage,
  receiveMessage,
}: {
  chat: ChatType | null;
  currentUserId: string | undefined;
  setSendMessage: (data: any) => void;
  receiveMessage: any;
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [otherUser, setOtherUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [text, setText] = useState<string>("");
  const { show, setShow, elementRef } = useClickOutside();
  const scroll = useRef() as React.MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    scroll.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (receiveMessage !== null && receiveMessage.chatId === chat?._id) {
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);

  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUserId);
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

    if (chat !== null) fetchUser();
  }, [chat, currentUserId, dispatch, navigate]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        if (chat?._id) {
          const { data } = await chatApi.getMessages(chat._id);
          setMessages(data);
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/login");
          dispatch(authActions.logout());
        } else {
          toast.error("There is something wrong here");
        }
      }
    }

    fetchMessages();
  }, [chat?._id]);

  const handleSend = async (e?: any) => {
    if (!text || e?.code !== "Enter") return;
    const message = {
      senderId: currentUserId,
      text,
      chatId: chat?._id,
    };

    try {
      const { data } = await chatApi.addMessage(message);
      setMessages([...messages, data]);
      setText("");
    } catch (error) {}

    // send message to socket server
    const receiverId = chat?.members.find((id) => id !== currentUserId);
    setSendMessage({ ...message, receiverId });
  };

  return (
    <>
      {chat ? (
        <>
          <div className="messenger-right-heading">
            <div className="messenger-right-heading_info">
              <Avatar
                style={{
                  width: "44px",
                  height: "44px",
                }}
                url={
                  otherUser?.profilePicture?.url ||
                  "https://img.myloview.com/stickers/default-avatar-profile-image-vector-social-media-user-icon-400-228654854.jpg"
                }
              ></Avatar>
              <div className="messenger-right-heading_name">
                {otherUser?.username}
              </div>
            </div>
          </div>
          <div className="messenger-right-inbox">
            {messages.map((message: MessageType) => (
              <div
                className={`messenger-right-inbox_${
                  message.senderId === currentUserId ? "send" : "receive"
                }`}
                key={uuidv4()}
                ref={scroll}
              >
                <div>{message.text}</div>
                <div>{moment(message.createdAt).fromNow()}</div>
              </div>
            ))}
          </div>
          <div className="messenger-right-field">
            <div className="emoji-container" ref={elementRef}>
              <i
                className="bi bi-emoji-smile"
                onClick={() => setShow(!show)}
              ></i>
              {show && (
                <div className="emoji-popup">
                  <Picker
                    data={data}
                    onEmojiSelect={(e: any) => {
                      setText(`${text}${e.native}`);
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
            </div>
            <input
              type="text"
              placeholder="Typing message..."
              className="messenger-right-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleSend}
            />
            <Button primary={1} onClick={handleSend}>
              Send
            </Button>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ChatBox;
