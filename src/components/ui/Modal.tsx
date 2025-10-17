import React from "react";
import { XIcon } from "../../assets/icons";
import style from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
}) => {
  if (!isOpen) return null;

  return (
    <div className={style.modalOverlay} onClick={onClose}>
      <div
        className={`${style.modal} ${style[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={style.modalHeader}>
          <h2 className={style.modalTitle}>{title}</h2>
          <button className={style.closeButton} onClick={onClose}>
            <XIcon size={20} />
          </button>
        </div>
        <div className={style.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
