import { SignType } from './../pages/Auth/Signup';
import { LoginType } from './../components/RightLogin/RightLogin';
import axiosClient from "./axiosClient";

const authApi = {
  register(data: SignType) {
    const url = `/auth/register`;
    return axiosClient.post(url, JSON.stringify(data));
  },
  login(data: LoginType) {
    const url = `/auth/login`;
    return axiosClient.post(url, JSON.stringify(data));
  },
}

export default authApi;