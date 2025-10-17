import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const RankingIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = "currentColor", 
  className 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M6 9L12 15L18 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RankingIcon;
