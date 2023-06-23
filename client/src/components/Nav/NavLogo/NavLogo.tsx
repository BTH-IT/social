import React from "react";
import { Link } from "react-router-dom";

const NavLogo = ({
  toggle,
  onClick,
}: {
  toggle: boolean;
  onClick: () => void;
}) => {
  return (
    <Link to="/" className="nav-logo-container" onClick={onClick}>
      <i
        className="bi bi-instagram nav-logo-icon"
        style={
          toggle
            ? {
                transform: "scale(1)",
                opacity: "1",
              }
            : {
                transform: "scale(0)",
                opacity: "0",
              }
        }
      ></i>
      <h4
        className="nav-logo"
        style={
          toggle
            ? {
                opacity: "0",
              }
            : {
                opacity: "1",
              }
        }
      >
        𝘽𝙏𝙃 𝙎𝙤𝙘𝙞𝙖𝙡
      </h4>
    </Link>
  );
};

export default NavLogo;
