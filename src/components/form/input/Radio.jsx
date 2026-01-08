import React from "react";

const Radio = ({
  id,
  name,
  value,
  checked,
  label,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      htmlFor={id}
      className={`relative flex select-none items-center gap-3 text-sm font-medium
        ${disabled ? "cursor-not-allowed text-gray-300" : "cursor-pointer text-gray-700"}
        ${className}`}
    >
      <input
        id={id}
        name={name}
        type="radio"
        value={value}
        checked={checked}
        onChange={() => !disabled && onChange(value)}
        className="sr-only"
        disabled={disabled}
      />

      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border-[1.5px]
          ${checked && !disabled ? "bg-blue-100" : "border-gray-300"}
          ${disabled ? "border-gray-200 bg-gray-100" : "bg-white"}
        `}
      >
        <span
          className={`h-2.5 w-2.5 rounded-full 
            ${checked && !disabled ? "bg-blue-500" : "bg-transparent"}
          `}
        />
      </span>

      {label}
    </label>
  );
};

export default Radio;
