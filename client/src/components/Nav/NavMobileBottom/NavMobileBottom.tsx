import React, { useState } from "react";
import styled from "styled-components";
import { StyledAvatar } from "../../../layouts/Navbar/Navbar";
import Create from "../../Create/Create";
import NavItem from "../NavItem/NavItem";
import NavLinkItem from "../NavLinkItem/NavLinkItem";
import { useAppSelector } from "../../../app/hooks";
import { SERVER } from "../../../utils/constant";

const StyledNavMobileBottom = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  background-color: white;
  border-bottom: 1px solid rgb(219, 219, 219);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid rgb(219, 219, 219);

  .nav-item {
    display: flex;
    align-items: center;
    padding: 12px;
    margin: 8px 0;
    text-decoration: none;
    font-size: 1.8rem;
    line-height: 24px;
    opacity: 0.8;
    color: black;
    cursor: pointer;
    border-radius: 24px;
    transition: all 0.2s ease;

    i {
      opacity: 1;
      font-size: 2.4rem;
      transition: all 0.2s ease;
    }

    &:hover {
      background-color: #f1f5f9;
      i {
        transform: scale(1.05);
      }
    }
  }

  .nav-item.active {
    font-weight: 600;

    img {
      border-color: black;
    }
  }

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const NavMobileBottom = () => {
  const user = useAppSelector((state) => state.auth.currentUser);
  const [create, setCreate] = useState<boolean>(false);

  return (
    <>
      <StyledNavMobileBottom>
        <NavLinkItem to="/" hasIconActive={true}>
          <i className="bi bi-house-door"></i>
          <i className="bi bi-house-door-fill active"></i>
        </NavLinkItem>
        <NavLinkItem to="/explore" hasIconActive={true}>
          <i className="bi bi-compass"></i>
          <i className="bi bi-compass-fill active"></i>
        </NavLinkItem>
        <NavItem toggle={create} onClick={() => setCreate(true)}>
          {create ? (
            <i className="bi bi-plus-square-fill active"></i>
          ) : (
            <i className="bi bi-plus-square"></i>
          )}
        </NavItem>
        <NavLinkItem to="/inbox" hasIconActive={true}>
          <i className="active">
            <img
              src="https://img.icons8.com/ios-glyphs/512/facebook-messenger.png"
              alt=""
              style={{
                width: "24px",
                height: "24px",
              }}
            />
          </i>
          <i>
            <img
              src="https://img.icons8.com/material-outlined/512/facebook-messenger.png"
              alt=""
              style={{
                width: "24px",
                height: "24px",
              }}
            />
          </i>
        </NavLinkItem>
        <NavLinkItem to={`/${user?._id}`}>
          <StyledAvatar
            src={
              user?.profilePicture
                ? `${SERVER}files/${user?.profilePicture}`
                : "https://img.myloview.com/stickers/default-avatar-profile-image-vector-social-media-user-icon-400-228654854.jpg"
            }
          ></StyledAvatar>
        </NavLinkItem>
      </StyledNavMobileBottom>
      <Create create={create} onClose={() => setCreate(!create)}></Create>
    </>
  );
};

export default NavMobileBottom;
