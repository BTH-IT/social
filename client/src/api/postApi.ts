import { CommentType } from '../components/Posts/PostComment';
import { CreateType } from './../components/Create/Create';
import axiosClient from "./axiosClient";

const postApi = {
  getYourTimeline(userId: string) {
    const url = `/post/your-timeline/${userId}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  getTimeline(userId: string) {
    const url = `/post/timeline/${userId}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  getPost(postId: string) {
    const url = `/post/${postId}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  getAllPost() {
    return axiosClient.get("/post/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  getSavedPost(userId: string) {
    const url = `/post/saved/${userId}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  createPost(data: CreateType) {
    return axiosClient.post("/post", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  likePost(postId: string, userId: string) {
    const url = `/post/like/${postId}`;
    return axiosClient.put(url, { userId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  savePost(postId: string, userId: string) {
    const url = `/post/saved/${postId}`;
    return axiosClient.put(url, { userId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  commentPost(postId: string, data: CommentType) {
    const url = `/post/comment/${postId}`;
    return axiosClient.put(url, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  likeCommentPost(postId: string, userId: string, commentId: string) {
    const url = `/post/comment/like/${postId}`;
    return axiosClient.put(url, { userId, commentId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  },
  deletePost(postId: string, userId: string) {
    const url = `/post/${userId}/${postId}`;
    return axiosClient.delete(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    });
  }
}

export default postApi;