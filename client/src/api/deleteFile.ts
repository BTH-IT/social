import axiosClient from "./axiosClient";

export default function deleteFile(filename: string) {
  return axiosClient.delete(`/upload/${filename}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
  });
}