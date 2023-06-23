import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
interface PortalProps {
  containerClassName?: String;
  bodyClassName?: String;
  containerStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  onClose?: () => void;
  visible?: boolean;
  children: React.ReactNode;
  overlay?: boolean;
  hasIconClose?: boolean;
}

const StyledOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: black;
  opacity: 0.2;
`;

const StyledIcon = styled.i`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: white;
  font-size: 4rem;
  z-index: 9999;
`;

function creatPortalWrapper() {
  const element = document.createElement("div");
  element.id = "portal-wrapper";
  return element;
}

const portalWrapperEle = creatPortalWrapper();

const Portal = ({
  children,
  containerClassName = "",
  containerStyle = {},
  bodyStyle = {},
  bodyClassName = "",
  onClose = () => {},
  hasIconClose = false,
  overlay = false,
}: PortalProps) => {
  useEffect(() => {
    document.body.appendChild(portalWrapperEle);
  }, []);

  const renderContent = (
    <div className={`${containerClassName}`} style={containerStyle}>
      {overlay && (
        <>
          {hasIconClose ? (
            <StyledIcon className="bi bi-x" onClick={onClose}></StyledIcon>
          ) : null}
          <StyledOverlay onClick={onClose}></StyledOverlay>
        </>
      )}
      <div className={`${bodyClassName}`} style={bodyStyle}>
        {children}
      </div>
    </div>
  );

  return createPortal(renderContent, portalWrapperEle);
};

export default Portal;
