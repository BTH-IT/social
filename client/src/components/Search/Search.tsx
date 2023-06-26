import { debounce } from "debounce";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import userApi from "../../api/userApi";
import { useAppDispatch } from "../../app/hooks";
import { authActions } from "../../redux/features/auth/authSlice";
import { SERVER } from "../../utils/constant";
import Avatar from "../Avatar/Avatar";
import Input from "../Input/Input";
import { UserType } from "../Posts/Post";
import AvatarStory from "../Avatar/AvatarStory";
import storyApi from "../../api/storyApi";

const StyledSearch = styled.div`
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 400px;
  position: fixed;
  z-index: 2;
  background-color: white;
  transform: translateX(-100%);
  transition: all 0.2s linear;
  border-radius: 0 20px 20px 0;

  .search-input {
    padding: 8px 12px 20px 12px;
    margin-bottom: 24px;

    h4 {
      font-size: 2.4rem;
      padding: 12px 14px 36px 24px;
      margin: 8px 0;
    }

    .input {
      input {
        padding: 12px 32px 12px 16px;
      }
    }
  }

  .search-suggest {
    width: 100%;
    border-top: 2px solid rgb(219, 219, 219);
    padding: 6px 0;

    .no-data {
      font-size: 2rem;
      font-weight: 500;
      text-align: center;
      opacity: 0.6;
    }
  }
`;

const StyledAvatarInfo = styled.div`
  a {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    gap: 20px;
    cursor: pointer;
    transition: all 0.2s linear;
    padding: 12px;
    text-decoration: none;
    color: black;

    span {
      font-size: 1.6rem;
      font-weight: 400;
      margin: 0;
      flex: 1;
    }

    &:hover {
      background-color: #f3f4f6;
    }
  }
`;

const AvatarInfo = ({ user }: { user: UserType }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [story, setStory] = useState<1 | 0>(0);
  useEffect(() => {
    async function fetchStory() {
      try {
        const { data } = await storyApi.getStoryByUserId(user._id);
        setStory(data.stories.length > 0 ? 1 : 0);
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/login");
          dispatch(authActions.logout());
        }
      }
    }

    fetchStory();
  }, []);
  return (
    <StyledAvatarInfo>
      <Link to={`/${user._id}`}>
        <AvatarStory
          story={story}
          style={{
            height: "36px",
            width: "36px",
          }}
          url={
            user?.profilePicture ||
            "https://img.myloview.com/stickers/default-avatar-profile-image-vector-social-media-user-icon-400-228654854.jpg"
          }
        ></AvatarStory>
        <span>{user?.username}</span>
      </Link>
    </StyledAvatarInfo>
  );
};

const Search = ({ search }: { search: boolean }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [userList, setUserList] = useState<UserType[]>([]);
  const [searching, setSearching] = useState<string>("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await userApi.getAll();
        if (searching) {
          res.data = res.data.filter((user: UserType) =>
            user.username.includes(searching)
          );
          setUserList(res.data);
        } else {
          setUserList([]);
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          navigate("/login");
          dispatch(authActions.logout());
        }
      }
    }

    fetchUsers();
  }, [dispatch, navigate, searching]);

  const handleChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    setSearching(e.target.value);
  }, 300);

  return (
    <StyledSearch
      style={{
        transform: search ? "translateX(75px)" : "",
      }}
    >
      <div className="search-input">
        <h4>Search</h4>
        <Input
          placeholder="Search"
          hasIcon
          primary={1}
          className="input"
          onChange={handleChange}
          defaultValue={searching}
        >
          <i className="bi bi-search"></i>
        </Input>
      </div>
      <div className="search-suggest">
        {userList.length > 0 ? (
          userList.map((user) => (
            <AvatarInfo user={user} key={user._id}></AvatarInfo>
          ))
        ) : (
          <div className="no-data">No Data</div>
        )}
      </div>
    </StyledSearch>
  );
};

export default Search;
