import { MessageSendType } from "../pages/Messenger/ChatBox";
import axiosClient from "./axiosClient";

const chatApi = {
  userChats(userId: string) {
    const url = `/chat/${userId}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    })
  },
  getMessages(chatId: string) {
    const url = `/message/${chatId}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    })
  },
  addMessage(message: MessageSendType) {
    return axiosClient.post("/message/", message, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    })
  },
  createChat(currentUserId: string, userId: string) {
    return axiosClient.post("/chat/", { senderId: currentUserId, receiverId: userId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    })
  }
}

export default chatApi;