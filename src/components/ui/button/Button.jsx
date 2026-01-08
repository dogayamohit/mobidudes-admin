import React from "react";

const Button = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button", // ✅ ADD DEFAULT TYPE
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-sm",
  };

  const variantClasses = {
    primary:
      "bg-blue-500 text-white shadow hover:bg-blue-600 disabled:bg-blue-300",
    outline:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    edit: "rounded-lg bg-yellow-100 p-2 hover:bg-yellow-200",
    delete: "rounded-lg bg-red-100 p-2 hover:bg-red-200",
    view: "rounded-lg bg-blue-100 p-2 hover:bg-blue-200",
    signIn: "rounded-lg bg-blue-400 p-2 hover:bg-blue-500 text-white",
    logout: "rounded-lg text-white bg-red-500 p-2 hover:bg-red-500",
    changePassword: "rounded-lg bg-purple-100 p-2 hover:bg-purple-200",
  };

  return (
    <button
      type={type} // ✅ PASS TYPE TO BUTTON
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
        ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
