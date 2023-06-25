import React from "react";
import styled from "styled-components";
interface AvatarProps {
  style?: React.CSSProperties;
  story?: 1 | 0;
  url?: string;
  href?: string;
}

const StyledAvatar = styled.a<AvatarProps>`
  margin: ${(props) => (props.story ? "0 auto" : "")};
  border-radius: 50%;
  width: 56px;
  height: 56px;
  position: relative;
  background-clip: padding-box;
  border: solid 3px transparent;
  z-index: 1;
  flex-shrink: 0;

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
    border: solid 1px white;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    margin: -3px;
    border-radius: inherit;
    background: ${(props) =>
      props.story
        ? "radial-gradient(rgba(0, 0, 0, 0.15) 60%, transparent 0), radial-gradient(white 65%, transparent 0), linear-gradient(to top right, orange, deeppink)"
        : "white"};
  }

  @media screen and (max-width: 526px) {
    width: 44px !important;
    height: 44px !important;
  }
`;

const Avatar = ({ style, story, url, href }: AvatarProps) => {
  return (
    <StyledAvatar className="avatar" style={style} story={story} href={href}>
      <img src={url} alt="" className="avatar-img" />
    </StyledAvatar>
  );
};

export default Avatar;
