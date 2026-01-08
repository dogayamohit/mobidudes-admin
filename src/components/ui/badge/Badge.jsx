import React from "react";

const Badge = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-1 rounded-full font-medium px-2.5 py-0.5";

  /* Size styles */
  const sizeStyles = {
    sm: "text-xs",
    md: "text-sm",
  };

  /* Variant & color styles */
 const variants = {
  light: {
    primary: "bg-blue-100 text-blue-600",
    success: "bg-green-100 text-green-600",
    error: "bg-red-100 text-red-600",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-sky-100 text-sky-600",
    light: "bg-gray-200 text-gray-700",
    dark: "bg-gray-800 text-white",
  },
  solid: {
    primary: "bg-blue-600 text-white",
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-sky-600 text-white",
    light: "bg-gray-400 text-white",
    dark: "bg-gray-800 text-white",
  },
};


  const sizeClass = sizeStyles[size];
  const colorClass = variants[variant][color];

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorClass}`}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
