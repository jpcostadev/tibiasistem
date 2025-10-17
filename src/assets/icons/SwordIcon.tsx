import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const SwordIcon: React.FC<IconProps> = ({
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
      <path d="M6.92 5H5L14 14L13 21L16.5 19L17.5 12L6.92 5Z" fill={color} />
      <path
        d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
        fill={color}
      />
    </svg>
  );
};

export default SwordIcon;
