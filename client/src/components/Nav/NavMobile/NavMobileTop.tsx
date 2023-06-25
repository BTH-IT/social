import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Input from "../../Input/Input";
import userApi from "../../../api/userApi";
import { toast } from "react-toastify";
import { authActions } from "../../../redux/features/auth/authSlice";
import { useAppDispatch } from "../../../app/hooks";

const StyledNavMobileTop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  background-color: white;
  border-bottom: 1px solid rgb(219, 219, 219);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  gap: 10px;

  .logo {
    font-size: 2.4rem;
    text-decoration: none;
    display: block;
    color: black;
    flex-shrink: 0;

    @media screen and (max-width: 526px) {
      font-size: 2rem;
    }
  }

  .right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    .notification {
      color: black;
    }

    .bi-heart {
      font-size: 2.4rem;

      @media screen and (max-width: 526px) {
        font-size: 2rem;
      }
    }
  }

  @media screen and (min-width: 768px) {
    display: none;
  }

  @media screen and (max-width: 768px) {
    padding: 5px 10px;
  }
`;

const NavMobileTop = () => {
  const [value, setValue] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <StyledNavMobileTop>
      <Link to="/" className="logo">
        𝘽𝙏𝙃 𝙎𝙤𝙘𝙞𝙖𝙡
      </Link>
      <div className="right">
        <Input
          placeholder="Search"
          hasIcon
          primary={1}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={async (e: React.KeyboardEvent) => {
            if (e.code !== "Enter") return;
            try {
              const { data } = await userApi.getUserIdByUsername(value);
              navigate("/" + data);
            } catch (error: any) {
              if (error.response.status === 401) {
                navigate("/login");
                dispatch(authActions.logout());
              } else {
                toast.error("no username: " + value);
              }
            }
          }}
        ></Input>
        <Link to="/accounts/notification" className="notification">
          <i className="bi bi-heart"></i>
        </Link>
      </div>
    </StyledNavMobileTop>
  );
};

export default NavMobileTop;
