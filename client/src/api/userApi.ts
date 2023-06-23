import { UserType } from './../components/Posts/Post';
import axiosClient from "./axiosClient";

const userApi = {
  get(userId: string) {
    const url = `/user/${userId}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  getUserIdByUsername(username: string) {
    const url = `/user/username/${username}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  getAll() {
    return axiosClient.get("/user/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  update(userId: string, user: UserType) {
    const url = `/user/${userId}`;
    return axiosClient.put(url, user, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  followUser(followerId: string, followingId: string) {
    const url = `/user/follow/${followerId}`;
    return axiosClient.put(url, { followingId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  unFollowUser(followerId: string, followingId: string) {
    const url = `/user/unfollow/${followerId}`;
    return axiosClient.put(url, { followingId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  }
}

export default userApi;