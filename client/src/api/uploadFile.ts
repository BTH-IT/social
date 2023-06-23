import axiosClient from "./axiosClient";

export default function uploadFile(data: FormData) {
  return axiosClient.post("/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
  });
}