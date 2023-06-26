import React, { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { useAppSelector } from "./app/hooks";
import storyApi from "./api/storyApi";
import { io } from "socket.io-client";

const Main = React.lazy(() => import("./layouts/Main/Main"));
const NotFoundPage = React.lazy(() => import("./pages/NotFound/NotFoundPage"));
const NotificationPage = React.lazy(
  () => import("./pages/Notification/NotificationPage")
);
const StoriesPage = React.lazy(() => import("./pages/Stories/StoriesPage"));
const Signup = React.lazy(() => import("./pages/Auth/Signup"));
const Login = React.lazy(() => import("./pages/Auth/Login"));
const EditAccount = React.lazy(() => import("./pages/EditAccount/EditAccount"));
const Explore = React.lazy(() => import("./pages/Explore/Explore"));
const ProfilePage = React.lazy(() => import("./pages/Profile/ProfilePage"));
const Home = React.lazy(() => import("./pages/Home/Home"));
const PostDetailPage = React.lazy(
  () => import("./pages/PostDetail/PostDetailPage")
);
const Messenger = React.lazy(() => import("./pages/Messenger/Messenger"));
const PostGrid = React.lazy(() => import("./components/PostGrid/PostGrid"));

export let SOCKET_SERVER = io("https://bth-social-socket.onrender.com/");

function App() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const loginSuccess = useAppSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    async function updateStoryNotExpired() {
      try {
        await storyApi.updateStoryNotExpired();
      } catch (error) {
        console.log("object");
      }
    }

    if (currentUser && currentUser._id) {
      updateStoryNotExpired();
    }
  }, [loginSuccess]);

  useLayoutEffect(() => {
    if (currentUser && currentUser._id) {
      SOCKET_SERVER = io("https://bth-social-socket.onrender.com/");
      SOCKET_SERVER.emit("connected", currentUser._id);
    }
  }, [currentUser]);

  return (
    <div className="App">
      <Routes>
        <Route
          path="*"
          element={
            <Suspense fallback={<p>Loading...</p>}>
              <NotFoundPage />
            </Suspense>
          }
        />
        <Route
          path="/"
          element={
            <Suspense>
              <Main />
            </Suspense>
          }
        >
          <Route
            path="/"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <Home />
              </Suspense>
            }
          ></Route>
          <Route
            path="/explore"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <Explore />
              </Suspense>
            }
          ></Route>
          <Route
            path="/inbox"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <Messenger />
              </Suspense>
            }
          ></Route>
          <Route
            path="/:userId/"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <ProfilePage />
              </Suspense>
            }
          >
            <Route
              path="/:userId/"
              element={
                <Suspense fallback={<p>Loading...</p>}>
                  <PostGrid />
                </Suspense>
              }
            ></Route>
            <Route
              path="/:userId/saved"
              element={
                <Suspense fallback={<p>Loading...</p>}>
                  <PostGrid />
                </Suspense>
              }
            ></Route>
            <Route
              path="/:userId/reels"
              element={
                <Suspense fallback={<p>Loading...</p>}>
                  <PostGrid />
                </Suspense>
              }
            ></Route>
          </Route>
          <Route
            path="/accounts/edit"
            element={
              <Suspense>
                <EditAccount />
              </Suspense>
            }
          ></Route>
          <Route
            path="/p/:postId"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <PostDetailPage />
              </Suspense>
            }
          ></Route>
          <Route
            path="/accounts/notification"
            element={
              <Suspense fallback={<p>Loading...</p>}>
                <NotificationPage />
              </Suspense>
            }
          ></Route>
        </Route>
        <Route
          path="/signup"
          element={
            <Suspense>
              <Signup />
            </Suspense>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <Suspense>
              <Login />
            </Suspense>
          }
        ></Route>
        <Route
          path="/stories/:storyId"
          element={
            <Suspense fallback={<p>Loading...</p>}>
              <StoriesPage />
            </Suspense>
          }
        ></Route>
      </Routes>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default App;
