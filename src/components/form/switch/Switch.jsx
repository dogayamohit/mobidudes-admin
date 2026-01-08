import { useState } from "react";

const Switch = ({
  label,
  defaultChecked = false,
  disabled = false,
  onChange,
  color = "blue",
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    if (disabled) return;
    const newState = !isChecked;
    setIsChecked(newState);
    onChange && onChange(newState);
  };

  const switchColors =
    color === "blue"
      ? {
          background: isChecked ? "bg-blue-500" : "bg-gray-200",
          knob: isChecked
            ? "translate-x-full bg-white"
            : "translate-x-0 bg-white",
        }
      : {
          background: isChecked ? "bg-gray-800" : "bg-gray-200",
          knob: isChecked
            ? "translate-x-full bg-white"
            : "translate-x-0 bg-white",
        };

  return (
    <label
      onClick={handleToggle}
      className={`flex select-none items-center gap-3 text-sm font-medium cursor-pointer ${
        disabled ? "text-gray-400" : "text-gray-700"
      }`}
    >
      <div className="relative">
        <div
          className={`h-6 w-11 rounded-full transition duration-150 ease-linear ${
            disabled
              ? "bg-gray-100 pointer-events-none"
              : switchColors.background
          }`}
        />
        <div
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-theme-sm transform transition duration-150 ease-linear ${switchColors.knob}`}
        />
      </div>
      {label}
    </label>
  );
};

export default Switch;
