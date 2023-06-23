import { FileNameType } from "../components/Create/Create";
import axiosClient from "./axiosClient";

const storyApi = {
  getTimelineStory(userId: string) {
    const url = `/story/timeline/${userId}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  getStory(storyId: string) {
    const url = `/story/${storyId}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  createStory(data: { userId: string; stories: FileNameType[] }) {
    return axiosClient.post("/story", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  updateStoryNotExpired() {
    return axiosClient.get("/story", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  getStoryByUserId(userId: string) {
    return axiosClient.get("/story/user-id/" + userId, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  }
}

export default storyApi;