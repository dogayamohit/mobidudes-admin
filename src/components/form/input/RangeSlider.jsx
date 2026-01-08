import React from "react";

const RangeSlider = ({
  id,
  name,
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  success = false,
  error = false,
  hint,
  showValue = true,
  className = "",
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const getTrackColor = () => {
    if (error) return "bg-red-500";
    if (success) return "bg-green-500";
    return "bg-blue-500";
  };

  return (
    <div className="w-full">
      {/* Value bubble */}
      {showValue && (
        <div className="mb-2 flex justify-end">
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-medium text-white transition ${
              error
                ? "bg-red-500"
                : success
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
          >
            {value}
          </span>
        </div>
      )}

      {/* Slider */}
      <div className="relative">
        {/* Background track */}
        <div className="h-2 w-full rounded-full bg-gray-200" />

        {/* Filled track */}
        <div
          className={`absolute top-0 h-2 rounded-full transition-all ${getTrackColor()}`}
          style={{ width: `${percentage}%` }}
        />

        <input
          type="range"
          id={id}
          name={name}
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={onChange}
          className={`
            absolute top-0 h-2 w-full appearance-none bg-transparent
            cursor-pointer focus:outline-none
            ${disabled ? "cursor-not-allowed opacity-40" : ""}
            ${className}
          `}
        />
      </div>

      {/* Meta info */}
      <div className="mt-1.5 flex items-center justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>

      {/* Hint */}
      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-red-500"
              : success
              ? "text-green-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default RangeSlider;
