import React from "react";
interface NavItemProps {
  title?: String;
  toggle: boolean;
  children: React.ReactNode;
  className?: String;
  onClick?: () => void;
}

const NavItem = ({
  title,
  children,
  toggle,
  className,
  onClick,
}: NavItemProps) => {
  return (
    <div className={`nav-item ${className}`} onClick={onClick}>
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

export default NavItem;
