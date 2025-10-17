import React from "react";
import style from "./Loading.module.css";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = "medium",
  text = "Carregando...",
  fullScreen = false,
}) => {
  return (
    <div
      className={`${style.loadingContainer} ${
        fullScreen ? style.fullScreen : ""
      }`}
    >
      <div className={`${style.spinner} ${style[size]}`}>
        <div className={style.spinnerRing}>
          <div className={style.spinnerRingInner}></div>
        </div>
        <div className={style.spinnerCenter}>
          <div className={style.spinnerIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={style.swordIcon}
            >
              <path
                d="M6.92 5H5L14 14L13 21L16.5 19L17.5 12L6.92 5Z"
                fill="currentColor"
              />
              <path
                d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
      {text && <p className={style.loadingText}>{text}</p>}
    </div>
  );
};

export default Loading;
