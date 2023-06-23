import axiosClient from "./axiosClient";

const notiApi = {
  createNotification(noti: any) {
    const url = `/notification`;
    return axiosClient.post(url, noti, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    })
  },
  getNotificationByUserId(userId: string) {
    const url = `/notification/${userId}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    })
  },
  addNotificationByUserId(noti: any, userId: string) {
    return axiosClient.post(`/notification/${userId}`, { notification: noti }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
    })
  }
}

export default notiApi;