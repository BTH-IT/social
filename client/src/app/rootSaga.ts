import { all } from "redux-saga/effects";
import authSaga from "../redux/features/auth/authSaga";

export default function* rootSaga() {
  yield all([authSaga()])
}