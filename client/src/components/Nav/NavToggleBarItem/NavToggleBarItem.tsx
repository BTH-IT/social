import React from "react";

interface NavToggleBarItemProps {
  title: String;
  toggle: boolean;
  toggleItem: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
const NavToggleBarItem = ({
  toggle,
  toggleItem,
  title,
  onToggle,
  children,
}: NavToggleBarItemProps) => {
  return (
    <div
      onClick={onToggle}
      style={{
        border: toggleItem ? "1px solid #9ca3af" : "",
      }}
      className="nav-item"
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
    </div>
  );
};

export default NavToggleBarItem;
