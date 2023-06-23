import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "../../../components/Posts/Post";
import { LoginType } from "../../../components/RightLogin/RightLogin";

export interface AuthState {
  isLoggedIn: boolean;
  logging?: boolean;
  currentUser?: UserType;
}

const initialState: AuthState = {
  isLoggedIn: Boolean(localStorage.getItem('access_token')),
  logging: false,
  currentUser: JSON.parse(localStorage.getItem('current_user') || '{}'),
}

const authSlide = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginType>) {
      state.logging = true;
    },
    loginSuccess(state, action: PayloadAction<UserType>) {
      state.logging = false;
      state.isLoggedIn = true;
      state.currentUser = action.payload;
    },
    loginFailed(state) {
      state.logging = false;
      state.isLoggedIn = false;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.currentUser = undefined;
    }
  }
})

// Actions
export const authActions = authSlide.actions;

// Selectors
export const selectAuth = (state: any) => state.auth;

// Reducer
const authReducer = authSlide.reducer;
export default authReducer;