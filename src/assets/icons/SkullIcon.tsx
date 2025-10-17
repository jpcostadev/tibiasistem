import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const SkullIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  className,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
      }}
    >
      <path
        d="M12 2C8.5 2 6 4.5 6 8C6 9.5 6.5 10.8 7.2 12C7.5 12.5 7.8 13 8 13.5C8.5 14.5 9 15.5 9 16.5C9 17.5 8.5 18 8 18.5C7.5 19 7 19.5 7 20C7 20.5 7.5 21 8 21H16C16.5 21 17 20.5 17 20C17 19.5 16.5 19 16 18.5C15.5 18 15 17.5 15 16.5C15 15.5 15.5 14.5 16 13.5C16.2 13 16.5 12.5 16.8 12C17.5 10.8 18 9.5 18 8C18 4.5 15.5 2 12 2Z"
        fill={color}
      />
      <circle cx="9" cy="9" r="1" fill="white" />
      <circle cx="15" cy="9" r="1" fill="white" />
      <path
        d="M9 14C9 14.5 9.5 15 10 15H14C14.5 15 15 14.5 15 14C15 13.5 14.5 13 14 13H10C9.5 13 9 13.5 9 14Z"
        fill="white"
      />
    </svg>
  );
};

export default SkullIcon;
