import React from "react";
import { NavLink, To } from "react-router-dom";

interface NavLinkItemProps {
  to: To;
  children: React.ReactNode;
  toggle?: boolean;
  title?: String;
  onClick?: () => void;
  hasIconActive?: boolean | false;
}

const NavLinkItem = ({
  title,
  to,
  children,
  toggle,
  onClick,
  hasIconActive,
}: NavLinkItemProps) => {
  return (
    <NavLink
      to={to ? to : ""}
      className={({ isActive }) =>
        isActive
          ? `nav-item ${hasIconActive ? "link" : ""} active`
          : `nav-item ${hasIconActive ? "link" : ""}`
      }
      onClick={onClick}
    >
      {children}
      <span
        className="nav-item-text"
        style={
          toggle
            ? {
                visibility: "hidden",
                opacity: "0",
              }
            : {
                visibility: "visible",
                opacity: "1",
              }
        }
      >
        {title}
      </span>
    </NavLink>
  );
};

export default NavLinkItem;
