import React from "react";
import { CSSTransition } from "react-transition-group";
import Portal from "../Portal/Portal";

interface ModalProps {
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

const Modal = ({
  visible,
  children,
  onClose,
  bodyClassName,
  containerClassName,
  ...props
}: ModalProps) => {
  return (
    <>
      <CSSTransition in={visible} unmountOnExit timeout={250} classNames="zoom">
        {(status) => (
          <Portal
            visible={status !== "exited"}
            onClose={onClose}
            containerClassName={`modal-container ${containerClassName}`}
            bodyStyle={{ transition: "all 3s linear" }}
            bodyClassName={`modal-body ${bodyClassName}`}
            {...props}
          >
            {children}
          </Portal>
        )}
      </CSSTransition>
    </>
  );
};

export default Modal;
