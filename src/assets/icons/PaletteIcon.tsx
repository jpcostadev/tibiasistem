import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const PaletteIcon: React.FC<IconProps> = ({
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
    >
      <circle cx="13.5" cy="6.5" r=".5" fill={color} />
      <circle cx="17.5" cy="10.5" r=".5" fill={color} />
      <circle cx="8.5" cy="7.5" r=".5" fill={color} />
      <circle cx="6.5" cy="12.5" r=".5" fill={color} />
      <path
        d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22C13.8 22 15.5 21.4 17 20.4C18.5 19.4 19.6 18 20.2 16.3C20.8 14.6 21 12.8 21 11C21 6.5 16.5 2 12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 21C8 21 8.5 19 10 19S12 21 12 21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PaletteIcon;
