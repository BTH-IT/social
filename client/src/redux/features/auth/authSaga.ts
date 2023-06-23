import { toast } from 'react-toastify';
import { authActions } from './authSlice';
import { fork, take, call, put } from 'redux-saga/effects';
import { LoginType } from './../../../components/RightLogin/RightLogin';
import { PayloadAction } from '@reduxjs/toolkit';
import authApi from '../../../api/authApi';

export interface ResponseGenerator {
  config?: any,
  data?: any,
  headers?: any,
  request?: any,
  status?: number,
  statusText?: string
}

export function* handleLogin(payload: LoginType) {
  try {
    const res: ResponseGenerator = yield call(authApi.login, payload);

    localStorage.setItem("access_token", res.data.jwtToken);
    localStorage.setItem('current_user', JSON.stringify(res.data.otherDetails));

    yield put(authActions.loginSuccess(res.data.otherDetails));

    toast.success(`Welcome back, ${res.data.otherDetails.username}!!`);

  } catch (error) {
    toast.error("Email or password is wrong...");
    yield put(authActions.loginFailed());
  }
}

function* handleLogout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("current_user");
}

function* watchLoginFlow() {
  while (true) {
    const isLoggedIn = Boolean(localStorage.getItem('access_token'));

    if (!isLoggedIn) {
      const action: PayloadAction<LoginType> = yield take(authActions.login.type);

      yield fork(handleLogin, action.payload);
      continue;
    }

    yield take(authActions.logout.type);
    yield call(handleLogout);
  }

}


export default function* authSaga() {
  yield fork(watchLoginFlow)
}